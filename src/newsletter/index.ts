import { websiteConfig } from '@/config/website';
import { BeehiivNewsletterProvider } from './provider/beehiiv';
import { ResendNewsletterProvider } from './provider/resend';
import type { NewsletterProvider, NewsletterProviderName } from './types';

type NewsletterProviderFactory = () => NewsletterProvider;

const providerRegistry: Partial<
  Record<NewsletterProviderName, NewsletterProviderFactory>
> = {
  resend: () => new ResendNewsletterProvider(),
  beehiiv: () => new BeehiivNewsletterProvider(),
};

let newsletterProvider: NewsletterProvider | null = null;

function createNewsletterProvider(): NewsletterProvider {
  const name = websiteConfig.newsletter.provider;
  if (!name)
    throw new Error('newsletter.provider is required in websiteConfig.');
  const factory = providerRegistry[name];
  if (!factory) throw new Error(`Unsupported newsletter provider: ${name}.`);
  return factory();
}

/**
 * Get the newsletter provider
 * @returns current newsletter provider instance
 */
export const getNewsletterProvider = (): NewsletterProvider => {
  if (!newsletterProvider) newsletterProvider = createNewsletterProvider();
  return newsletterProvider;
};

/**
 * Subscribe a user to the newsletter
 * @param email The email address to subscribe
 * @returns True if the subscription was successful, false otherwise
 */
export const subscribe = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.subscribe({ email });
};

/**
 * Unsubscribe a user from the newsletter
 * @param email The email address to unsubscribe
 * @returns True if the unsubscription was successful, false otherwise
 */
export const unsubscribe = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.unsubscribe({ email });
};

/**
 * Check if a user is subscribed to the newsletter
 * @param email The email address to check
 * @returns True if the user is subscribed, false otherwise
 */
export const isSubscribed = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.checkSubscribeStatus({ email });
};
