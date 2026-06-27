import { websiteConfig } from '@/config/website';
import { isE2ETestMode } from '@/lib/e2e';
import { ResendProvider } from './provider/resend';
import type {
  MailProvider,
  MailProviderName,
  SendEmailResult,
  SendRawEmailParams,
  SendTemplateParams,
} from './types';
export { getTemplate } from './template';

type MailProviderFactory = () => MailProvider;

const providerRegistry: Partial<Record<MailProviderName, MailProviderFactory>> =
  {
    resend: () => new ResendProvider(),
  };

/**
 * Global mail provider instance
 */
let mailProvider: MailProvider | null = null;

/**
 * Get the mail provider
 * @returns current mail provider instance
 * @throws Error if provider is not initialized
 */
export const getMailProvider = (): MailProvider => {
  if (!mailProvider) mailProvider = createMailProvider();
  return mailProvider;
};

function createMailProvider(): MailProvider {
  const name = websiteConfig.mail.provider;
  if (!name) throw new Error('mail.provider is required in websiteConfig.');
  const factory = providerRegistry[name];
  if (!factory) throw new Error(`Unsupported mail provider: ${name}.`);
  return factory();
}

/**
 * Send email using the configured mail provider.
 *
 * Returns a `SendEmailResult` so callers can distinguish "feature disabled"
 * from "send failed" and access error details when needed.
 *
 * @param params Email parameters
 * @returns Send result with success status, optional messageId, and error
 */
export async function sendEmail(
  params: SendTemplateParams | SendRawEmailParams
): Promise<SendEmailResult> {
  if (isE2ETestMode()) {
    return { success: true, messageId: 'e2e-noop' };
  }

  if (!websiteConfig.mail?.enable) {
    return { success: false, error: 'Mail feature is disabled' };
  }

  try {
    const provider = getMailProvider();

    const result =
      'template' in params
        ? await provider.sendTemplate(params)
        : await provider.sendRawEmail(params);

    if (!result.success) {
      console.error('[mail] Send failed:', result.error);
    }

    return result;
  } catch (error) {
    console.error('[mail] Unexpected error:', error);
    return { success: false, error };
  }
}
