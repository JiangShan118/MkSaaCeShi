'use client';

import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BaseCheckoutButtonProps {
  /** Called when the button is clicked; should return the checkout URL or null on failure */
  onCheckout: (
    metadata: Record<string, string>
  ) => Promise<{ url: string } | null>;
  /** Extra metadata supplied by the parent (e.g. referral info already collected) */
  metadata?: Record<string, string>;
  /** Toast message shown on checkout failure */
  errorMessage: string;
  /** Label shown while loading */
  loadingLabel: string;
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
 * Collect affiliate referral metadata from the current browser context.
 *
 * Supports PromoteKit (window global) and Affonso (cookie-based).
 */
function collectAffiliateMetadata(): Record<string, string> {
  const meta: Record<string, string> = {};

  if (!websiteConfig.affiliates?.enable) return meta;

  if (websiteConfig.affiliates.provider === 'promotekit') {
    const ref =
      typeof window !== 'undefined'
        ? (window as any).promotekit_referral
        : undefined;
    if (ref) meta.promotekit_referral = ref;
  }

  if (websiteConfig.affiliates.provider === 'affonso') {
    const ref =
      typeof document !== 'undefined'
        ? (() => {
            const match = document.cookie.match(
              /(?:^|; )affonso_referral=([^;]*)/
            );
            return match ? decodeURIComponent(match[1]) : null;
          })()
        : null;
    if (ref) meta.affonso_referral = ref;
  }

  return meta;
}

/**
 * Shared checkout button used by both plan checkout and credit checkout.
 *
 * Handles affiliate metadata collection, loading state, error toasts,
 * and redirecting to the Stripe checkout URL.
 */
export function BaseCheckoutButton({
  onCheckout,
  metadata,
  errorMessage,
  loadingLabel,
  variant = 'default',
  size = 'default',
  className,
  children,
  disabled = false,
}: BaseCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const mergedMetadata: Record<string, string> = {
        ...metadata,
        ...collectAffiliateMetadata(),
      };

      const result = await onCheckout(mergedMetadata);

      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
