'use server';

import { getDb } from '@/db';
import { payment } from '@/db/schema';
import { userActionClient } from '@/lib/safe-action';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const checkPaymentCompletionSchema = z.object({
  sessionId: z.string(),
});

/**
 * Check if a payment is completed for the given session ID.
 */
export const checkPaymentCompletionAction = userActionClient
  .inputSchema(checkPaymentCompletionSchema)
  .action(async ({ parsedInput: { sessionId }, ctx }) => {
    try {
      const db = await getDb();
      const paymentRecord = await db
        .select()
        .from(payment)
        .where(
          and(eq(payment.sessionId, sessionId), eq(payment.userId, ctx.user.id))
        )
        .limit(1);

      const paymentData = paymentRecord[0] || null;
      const isPaid = paymentData ? paymentData.paid : false;
      console.log('Check payment completion, isPaid:', isPaid);

      return {
        success: true,
        isPaid,
      };
    } catch (error) {
      console.error('Check payment completion error:', error);
      return {
        success: false,
        error: 'Failed to check payment completion',
      };
    }
  });
