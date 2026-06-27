import { handleWebhookEvent } from '@/payment';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Stripe webhook handler
 * This endpoint receives webhook events from Stripe and processes them
 *
 * @param req The incoming request
 * @returns NextResponse
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Get the request body as text
  const payload = await req.text();

  // Get the Stripe signature from headers
  const signature = req.headers.get('stripe-signature') || '';

  try {
    // Validate inputs
    if (!payload || !signature) {
      console.warn('Stripe webhook: missing payload or signature');
      return NextResponse.json(
        { error: 'Missing payload or signature' },
        { status: 400 }
      );
    }

    // Process the webhook event
    await handleWebhookEvent(payload, signature);

    // Return success
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error in webhook route:', error);

    // IMPORTANT: Return 200 to acknowledge receipt even on processing errors.
    // Stripe interprets 4xx/5xx as delivery failure and will retry the event
    // indefinitely (up to 3 days), which can cause duplicate processing and
    // unnecessary load. The error has already been logged for investigation.
    return NextResponse.json(
      { error: 'Webhook handler failed', received: true },
      { status: 200 }
    );
  }
}
