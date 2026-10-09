const base = process.env.MONITOR_BASE;
async function identityToken() {
  if (process.env.SITEMAP_INGEST_TOKEN) return process.env.SITEMAP_INGEST_TOKEN;
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL; const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) throw new Error("missing_github_oidc_environment");
  const separator = requestUrl.includes("?") ? "&" : "?";
  const response = await fetch(`${requestUrl}${separator}audience=sitemap-monitor-worker`, { headers: { Authorization: `Bearer ${requestToken}` }, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`oidc_http_${response.status}`);
  const body = await response.json(); if (typeof body.value !== "string") throw new Error("invalid_oidc_response"); return body.value;
}
if (!base) throw new Error("missing_monitor_configuration");
const token = await identityToken();

const headers = { Authorization: `Bearer ${token}` };
const userAgent = "SitemapMonitor/1.0 (+https://example.invalid/monitor)";
const maxBytes = 4_000_000;
const maxDocuments = 40;
const maxUrls = 10_000;

function decodeXml(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function safeUrl(raw, host) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== host.toLowerCase() || (url.port && url.port !== "443")) throw new Error("unsafe_or_foreign_url");
  return url;
}

async function fetchText(raw, host) {
  let current = safeUrl(raw, host);
  for (let hop = 0; hop <= 5; hop++) {
    const response = await fetch(current, { redirect: "manual", headers: { "User-Agent": userAgent, Accept: "application/xml,text/xml,text/plain" }, signal: AbortSignal.timeout(30_000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location"); if (!location) throw new Error("redirect_without_location");
      current = safeUrl(new URL(location, current).toString(), host); continue;
    }
    if (!response.ok) throw new Error(`http_${response.status}`);
    const length = Number(response.headers.get("content-length") || "0"); if (length > maxBytes) throw new Error("response_too_large");
    const reader = response.body?.getReader(); const chunks = []; let total = 0;
    while (reader) { const part = await reader.read(); if (part.done) break; total += part.value.byteLength; if (total > maxBytes) { await reader.cancel(); throw new Error("response_too_large"); } chunks.push(part.value); }
    const bytes = new Uint8Array(total); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const text = new TextDecoder().decode(bytes);
    if (/\.well-known\/sgcaptcha\/|cf-chl-/i.test(text)) throw new Error("access_challenge");
    return text;
  }
  throw new Error("too_many_redirects");
}

async function discover(target) {
  const origin = new URL(target.canonical_origin); const host = origin.hostname;
  let seeds = target.sitemap_url ? [target.sitemap_url] : [];
  if (!seeds.length) {
    try {
      const robots = await fetchText(`${origin.origin}/robots.txt`, host);
      seeds = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((match) => decodeXml(match[1]));
    } catch (error) { console.log(JSON.stringify({ competitor_id: target.id, stage: "robots", error: error.message })); }
  }
  if (!seeds.length) seeds = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"].map((path) => `${origin.origin}${path}`);
  const queue = seeds.map((seed) => safeUrl(seed, host).toString()); const visited = new Set(); const urls = new Set(); const failures = [];
  while (queue.length && visited.size < maxDocuments) {
    const sitemap = queue.shift(); if (visited.has(sitemap)) continue; visited.add(sitemap);
    try {
      const xml = await fetchText(sitemap, host); const isIndex = /<sitemapindex\b/i.test(xml); const isUrlset = /<urlset\b/i.test(xml);
      if (!isIndex && !isUrlset) throw new Error("invalid_sitemap_document");
      const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeXml(match[1].trim())).filter(Boolean);
      if (isIndex) for (const loc of locs) { if (visited.size + queue.length >= maxDocuments) throw new Error("document_budget_exceeded"); queue.push(safeUrl(loc, host).toString()); }
      else for (const loc of locs) { const value = safeUrl(loc, host); value.hash = ""; urls.add(value.toString().replace(/\/$/, "")); if (urls.size > maxUrls) throw new Error("url_budget_exceeded"); }
    } catch (error) { failures.push(`${sitemap}:${error.message}`); }
  }
  if (!urls.size || failures.length || queue.length) throw new Error(`incomplete_discovery:${failures.join("|") || "budget_exceeded"}`);
  return [...urls].sort();
}

const targetsResponse = await fetch(`${base}/api/fallback/targets`, { headers, signal: AbortSignal.timeout(30_000) });
if (!targetsResponse.ok) throw new Error(`targets_http_${targetsResponse.status}`);
const { targets } = await targetsResponse.json();
let failures = 0;
for (const target of targets) {
  try {
    const urls = await discover(target);
    const response = await fetch(`${base}/api/fallback/ingest`, { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ competitor_id: target.id, urls }), signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`ingest_http_${response.status}:${await response.text()}`);
    const receipt = await response.json(); console.log(JSON.stringify({ competitor_id: target.id, urls: urls.length, run_id: receipt.run_id }));
  } catch (error) { failures++; console.error(JSON.stringify({ competitor_id: target.id, error: error.message })); }
}
console.log(JSON.stringify({ ok: failures === 0, targets: targets.length, failures }));
if (failures) process.exitCode = 1;


