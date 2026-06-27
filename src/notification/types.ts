import type { NotificationConfig } from '@/types';

/** Supported notification provider names */
export type NotificationProviderName = NonNullable<
  NotificationConfig['provider']
>;

/** Params for sending a payment notification */
export interface SendPaymentNotificationParams {
  sessionId: string;
  customerId: string;
  userName: string;
  amount: number;
}

/** Params for sending a credit distribution notification */
export interface SendCreditDistributionNotificationParams {
  usersCount: number;
  processedCount: number;
  errorCount: number;
}

/**
 * Notification provider interface
 */
export interface NotificationProvider {
  /**
   * Get the notification provider name
   */
  getProviderName(): string;

  /**
   * Send a payment notification
   */
  sendPaymentNotification(params: SendPaymentNotificationParams): Promise<void>;

  /**
   * Send a credit distribution notification
   */
  sendCreditDistributionNotification(
    params: SendCreditDistributionNotificationParams
  ): Promise<void>;
}
