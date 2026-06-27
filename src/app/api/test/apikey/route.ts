import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Test verify an API key
 *
 * @see https://www.better-auth.com/docs/plugins/api-key#verify-an-api-key
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body as { key?: string };

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          error: { message: 'API key is required', code: 'MISSING_KEY' },
        },
        { status: 400 }
      );
    }

    // Use better-auth's verifyApiKey method
    const result = await auth.api.verifyApiKey({
      body: { key },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API key verification error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: { message: 'Verification failed', code: 'VERIFICATION_ERROR' },
      },
      { status: 500 }
    );
  }
}
