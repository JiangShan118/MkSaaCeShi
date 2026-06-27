'use client';

import { createCheckoutAction } from '@/actions/create-checkout-session';
import { BaseCheckoutButton } from '@/components/shared/base-checkout-button';
import { useTranslations } from 'next-intl';

interface CheckoutButtonProps {
  userId: string;
  planId: string;
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
}

/**
 * Checkout Button
 *
 * This client component creates a Stripe checkout session and redirects to it
 * It's used to initiate the checkout process for a specific plan and price.
 *
 * NOTICE: Login is required when using this button.
 */
export function CheckoutButton({
  userId,
  planId,
  priceId,
  metadata,
  variant,
  size,
  className,
  children,
}: CheckoutButtonProps) {
  const t = useTranslations('PricingPage.CheckoutButton');

  const handleCheckout = async (mergedMetadata: Record<string, string>) => {
    const result = await createCheckoutAction({
      userId,
      planId,
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
    >
      {children}
    </BaseCheckoutButton>
  );
}
