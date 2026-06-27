import { getMessagesForLocale } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import type { Locale, Messages } from 'next-intl';
import type { ReactElement } from 'react';
import { type EmailTemplate, EmailTemplates } from './types';

const renderEmailHtml = async (email: ReactElement): Promise<string> => {
  // Avoid @react-email/render to prevent prettier imports in workerd.
  const reactDomServer = (await import('react-dom/server')) as {
    renderToReadableStream?: (element: ReactElement) => Promise<ReadableStream>;
    renderToStaticMarkup?: (element: ReactElement) => string;
    renderToString?: (element: ReactElement) => string;
  };

  if (reactDomServer.renderToReadableStream) {
    const stream = await reactDomServer.renderToReadableStream(email);
    return await new Response(stream).text();
  }

  if (reactDomServer.renderToStaticMarkup) {
    return reactDomServer.renderToStaticMarkup(email);
  }

  if (reactDomServer.renderToString) {
    return reactDomServer.renderToString(email);
  }

  return '';
};

/** Common named HTML entities -> their decoded characters */
const NAMED_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&copy;': '\u00A9',
  '&reg;': '\u00AE',
  '&trade;': '\u2122',
  '&ndash;': '\u2013',
  '&mdash;': '\u2014',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&bull;': '\u2022',
  '&hellip;': '\u2026',
};

const decodeHtmlEntities = (text: string): string =>
  text
    // Hex numeric entities: &#xHHHH;
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    // Decimal numeric entities: &#DDDD;
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(Number.parseInt(dec, 10))
    )
    // Named entities: &name;
    .replace(/&[a-zA-Z]+;/g, (entity) => NAMED_ENTITIES[entity] ?? entity);

const toPlainText = (html: string): string => {
  // Simple HTML-to-text fallback for email providers.
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return decodeHtmlEntities(stripped);
};

/**
 * Get rendered email for given template, context, and locale
 */
export async function getTemplate<T extends EmailTemplate>({
  template,
  context,
  locale = routing.defaultLocale,
}: {
  template: T;
  context: Record<string, any>;
  locale?: Locale;
}) {
  const mainTemplate = EmailTemplates[template];
  const messages = await getMessagesForLocale(locale);

  const email = mainTemplate({
    ...(context as any),
    locale,
    messages,
  });

  // Get the subject from the messages
  const subject =
    'subject' in messages.Mail[template as keyof Messages['Mail']]
      ? messages.Mail[template].subject
      : '';

  const html = await renderEmailHtml(email);
  const text = toPlainText(html);

  return { html, text, subject };
}
