import {
  account,
  apikey,
  creditTransaction,
  payment,
  session,
  user,
  userCredit,
} from '@/db/schema';
import { getDb } from '@/db';
import { isValidE2ETestRequest } from '@/lib/e2e';
import { inArray, like, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const TEST_EMAIL_PATTERN = 'e2e-%@example.test';

function isE2EEmail(email: string) {
  return email.startsWith('e2e-') && email.endsWith('@example.test');
}

function notFound() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function PATCH(request: Request) {
  if (!isValidE2ETestRequest(request)) {
    return notFound();
  }

  const body = (await request.json()) as {
    email?: unknown;
    emailVerified?: unknown;
    role?: unknown;
  };
  const email = typeof body.email === 'string' ? body.email : '';

  if (!isE2EEmail(email)) {
    return NextResponse.json({ error: 'Invalid test email' }, { status: 400 });
  }

  const updates: {
    emailVerified?: boolean;
    role?: string | null;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (typeof body.emailVerified === 'boolean') {
    updates.emailVerified = body.emailVerified;
  }
  if (body.role === null || body.role === 'admin' || body.role === 'user') {
    updates.role = body.role === 'user' ? null : body.role;
  }

  const db = await getDb();
  const [updatedUser] = await db
    .update(user)
    .set(updates)
    .where(eq(user.email, email))
    .returning({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
    });

  if (!updatedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: updatedUser });
}

export async function DELETE(request: Request) {
  if (!isValidE2ETestRequest(request)) {
    return notFound();
  }

  const db = await getDb();
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(like(user.email, TEST_EMAIL_PATTERN));
  const userIds = rows.map((row) => row.id);

  if (userIds.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  await db.delete(apikey).where(inArray(apikey.userId, userIds));
  await db.delete(session).where(inArray(session.userId, userIds));
  await db.delete(account).where(inArray(account.userId, userIds));
  await db
    .delete(creditTransaction)
    .where(inArray(creditTransaction.userId, userIds));
  await db.delete(userCredit).where(inArray(userCredit.userId, userIds));
  await db.delete(payment).where(inArray(payment.userId, userIds));
  await db.delete(user).where(inArray(user.id, userIds));

  return NextResponse.json({ deleted: userIds.length });
}
