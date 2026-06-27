'use client';

import { createCreditCheckoutSession } from '@/actions/create-credit-checkout-session';
import { BaseCheckoutButton } from '@/components/shared/base-checkout-button';
import { useTranslations } from 'next-intl';

interface CreditCheckoutButtonProps {
  userId: string;
  packageId: string;
  priceId: string;
  metadata?: Record<string, string>;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Credit Checkout Button
 *
 * This client component creates a Stripe checkout session for credit purchases
 * and redirects to it. It's used to initiate the credit purchase process.
 *
 * NOTICE: Login is required when using this button.
 */
export function CreditCheckoutButton({
  userId,
  packageId,
  priceId,
  metadata,
  variant,
  size,
  className,
  children,
  disabled,
}: CreditCheckoutButtonProps) {
  const t = useTranslations('Dashboard.settings.credits.packages');

  const handleCheckout = async (mergedMetadata: Record<string, string>) => {
    const result = await createCreditCheckoutSession({
      userId,
      packageId,
      priceId,
      metadata:
        Object.keys(mergedMetadata).length > 0 ? mergedMetadata : undefined,
    });

    if (result?.data?.success && result?.data?.data?.url) {
      return { url: result.data.data.url };
    }
    return null;
  };

  return (
    <BaseCheckoutButton
      onCheckout={handleCheckout}
      metadata={metadata}
      errorMessage={t('checkoutFailed')}
      loadingLabel={t('loading')}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
    >
      {children}
    </BaseCheckoutButton>
  );
}
