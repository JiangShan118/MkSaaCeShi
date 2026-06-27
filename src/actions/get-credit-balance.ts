'use server';

import { getUserCredits } from '@/credits/credits';
import { userActionClient } from '@/lib/safe-action';

/**
 * Get current user's credits
 */
export const getCreditBalanceAction = userActionClient.action(
  async ({ ctx }) => {
    try {
      const credits = await getUserCredits(ctx.user.id);
      return { success: true, credits };
    } catch (error) {
      console.error('get credit balance error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch credit balance',
      };
    }
  }
);
