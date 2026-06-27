/** Default timeout for webhook requests (10 seconds) */
const DEFAULT_TIMEOUT_MS = 10_000;

/** Default number of retry attempts */
const DEFAULT_MAX_RETRIES = 2;

/** Base delay between retries in milliseconds (exponential back-off) */
const BASE_RETRY_DELAY_MS = 1_000;

/**
 * Send a JSON payload to a webhook URL with timeout and retry.
 *
 * - Uses `AbortController` to enforce a per-request timeout so a
 *   non-responsive endpoint doesn't block the caller indefinitely.
 * - Retries transient failures (network errors and 5xx responses)
 *   with exponential back-off.
 *
 * @param webhookUrl  Target webhook URL
 * @param body        JSON-serialisable payload
 * @param options     Optional overrides for timeout / retries
 */
export async function sendWebhookMessage(
  webhookUrl: string,
  body: Record<string, unknown>,
  options?: { timeoutMs?: number; maxRetries?: number }
): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Success — nothing more to do
      if (response.ok) return;

      // 5xx: server-side error, worth retrying
      if (response.status >= 500) {
        lastError = new Error(
          `Webhook returned ${response.status}: ${response.statusText}`
        );
        // fall through to retry logic below
      } else {
        // 4xx or other client error — retrying won't help
        console.error(
          `Webhook request failed with ${response.status}: ${response.statusText}`
        );
        return;
      }
    } catch (error) {
      clearTimeout(timer);
      lastError = error;

      // AbortError means timeout — worth retrying
      // TypeError usually means network failure — also worth retrying
      if (
        !(error instanceof DOMException && error.name === 'AbortError') &&
        !(error instanceof TypeError)
      ) {
        // Unknown error type — don't retry
        console.error('Webhook request failed with unexpected error:', error);
        return;
      }
    }

    // Wait before retrying (skip delay on last attempt)
    if (attempt < maxRetries) {
      const delay = BASE_RETRY_DELAY_MS * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All attempts exhausted
  console.error(
    `Webhook request failed after ${maxRetries + 1} attempts. Last error:`,
    lastError
  );
}
