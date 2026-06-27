import type { NewsletterConfig } from '@/types';

/** Newsletter provider name from website config */
export type NewsletterProviderName = NonNullable<NewsletterConfig['provider']>;

export interface SubscribeNewsletterParams {
  email: string;
}

export interface UnsubscribeNewsletterParams {
  email: string;
}

export interface CheckSubscribeStatusParams {
  email: string;
}

export type SubscribeNewsletterHandler = (
  params: SubscribeNewsletterParams
) => Promise<boolean>;

export type UnsubscribeNewsletterHandler = (
  params: UnsubscribeNewsletterParams
) => Promise<boolean>;

export type CheckSubscribeStatusHandler = (
  params: CheckSubscribeStatusParams
) => Promise<boolean>;

/**
 * Newsletter provider, currently only Resend is supported
 */
export interface NewsletterProvider {
  /**
   * Subscribe to the newsletter
   */
  subscribe: SubscribeNewsletterHandler;

  /**
   * Unsubscribe from the newsletter
   */
  unsubscribe: UnsubscribeNewsletterHandler;

  /**
   * Check if the user is subscribed to the newsletter
   */
  checkSubscribeStatus: CheckSubscribeStatusHandler;

  /**
   * Get the newsletter provider name
   */
  getProviderName(): string;
}
