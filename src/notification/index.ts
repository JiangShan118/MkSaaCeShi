import { websiteConfig } from '@/config/website';
import { DiscordProvider } from './provider/discord';
import { FeishuProvider } from './provider/feishu';
import type {
  NotificationProvider,
  NotificationProviderName,
  SendCreditDistributionNotificationParams,
  SendPaymentNotificationParams,
} from './types';

type ProviderFactory = () => NotificationProvider;

const providerRegistry: Partial<
  Record<NotificationProviderName, ProviderFactory>
> = {
  discord: () => new DiscordProvider(),
  feishu: () => new FeishuProvider(),
};

let notificationProvider: NotificationProvider | null = null;

function createProvider(): NotificationProvider {
  const name = websiteConfig.notification?.provider;
  if (!name)
    throw new Error('notification.provider is required in websiteConfig.');
  const factory = providerRegistry[name];
  if (!factory) {
    throw new Error(`Unsupported notification provider: ${name}.`);
  }
  return factory();
}

export function getNotificationProvider(): NotificationProvider {
  if (!notificationProvider) notificationProvider = createProvider();
  return notificationProvider;
}

export async function sendPaymentNotification(
  params: SendPaymentNotificationParams
): Promise<void> {
  if (!websiteConfig.notification?.enable) return;
  const provider = getNotificationProvider();
  await provider.sendPaymentNotification(params);
}

export async function sendCreditDistributionNotification(
  params: SendCreditDistributionNotificationParams
): Promise<void> {
  if (!websiteConfig.notification?.enable) return;
  const provider = getNotificationProvider();
  await provider.sendCreditDistributionNotification(params);
}
