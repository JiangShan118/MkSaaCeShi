'use server';

import { websiteConfig } from '@/config/website';
import { findPlanByPlanId } from '@/lib/price-plan';
import { userActionClient } from '@/lib/safe-action';
import { getUrlWithLocale } from '@/lib/urls';
import { createCheckout } from '@/payment';
import type { CreateCheckoutParams } from '@/payment/types';
import { Routes } from '@/routes';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Checkout schema for validation
// metadata is optional, and may contain referral information if you need
const checkoutSchema = z.object({
  userId: z.string().min(1, { error: 'User ID is required' }),
  planId: z.string().min(1, { error: 'Plan ID is required' }),
  priceId: z.string().min(1, { error: 'Price ID is required' }),
  metadata: z.record(z.string(), z.string()).optional(),
});

/**
 * Create a checkout session for a price plan
 */
export const createCheckoutAction = userActionClient
  .inputSchema(checkoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { planId, priceId, metadata } = parsedInput;
    const currentUser = ctx.user;

    try {
      // Get the current locale from the request
      const locale = await getLocale();

      // Check if plan exists
      const plan = findPlanByPlanId(planId);
      if (!plan) {
        return {
          success: false,
          error: 'Price plan not found',
        };
      }

      // Add user id to metadata, so we can get it in the webhook event
      const customMetadata: Record<string, string> = {
        ...metadata,
        userId: currentUser.id,
        userName: currentUser.name,
      };

      // https://datafa.st/docs/stripe-checkout-api
      // if datafast analytics is enabled, add the revenue attribution to the metadata
      if (websiteConfig.features.enableDatafastRevenueTrack) {
        const cookieStore = await cookies();
        customMetadata.datafast_visitor_id =
          cookieStore.get('datafast_visitor_id')?.value ?? '';
        customMetadata.datafast_session_id =
          cookieStore.get('datafast_session_id')?.value ?? '';
      }

      // Create the checkout session with localized URLs
      // For Stripe: {CHECKOUT_SESSION_ID} is replaced by Stripe on redirect,
      //   then the Payment page polls by sessionId until the webhook writes the DB record.
      // For Creem: Creem does NOT replace URL placeholders and has its own
      //   payment confirmation page, so redirect straight to billing.
      const isCreem = websiteConfig.payment.provider === 'creem';
      const successUrl = isCreem
        ? getUrlWithLocale(Routes.SettingsBilling, locale)
        : getUrlWithLocale(
            `${Routes.Payment}?session_id={CHECKOUT_SESSION_ID}&callback=${Routes.SettingsBilling}`,
            locale
          );
      const cancelUrl = getUrlWithLocale(Routes.SettingsBilling, locale);
      const params: CreateCheckoutParams = {
        planId,
        priceId,
        customerEmail: currentUser.email,
        metadata: customMetadata,
        successUrl,
        cancelUrl,
        locale,
      };

      const result = await createCheckout(params);
      // console.log('create checkout session result:', result);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('create checkout session error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });
