import { createSafeActionClient } from 'next-safe-action';
import type { SessionUser } from './auth-types';
import { isDemoWebsite } from './demo';
import { getSession } from './server';

// -----------------------------------------------------------------------------
// 1. Base action client – put global error handling / metadata here if needed
// -----------------------------------------------------------------------------
export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof Error) {
      return {
        success: false,
        error: e.message,
      };
    }

    return {
      success: false,
      error: 'Something went wrong while executing the action',
    };
  },
});

// -----------------------------------------------------------------------------
// 2. Auth-guarded client
// -----------------------------------------------------------------------------
export const userActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return next({ ctx: { user: session.user as SessionUser } });
});

// -----------------------------------------------------------------------------
// 3. Admin-only client (extends auth client)
//
// SECURITY: Always requires admin role, regardless of demo mode.
// Use `demoReadonlyAdminActionClient` for read-only admin actions
// that should be accessible to demo users.
// -----------------------------------------------------------------------------
export const adminActionClient = userActionClient.use(async ({ next, ctx }) => {
  if (ctx.user.role !== 'admin') {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  return next({ ctx });
});

// -----------------------------------------------------------------------------
// 4. Demo-aware read-only admin client (extends auth client)
//
// Allows non-admin users to access read-only admin actions when running in
// demo mode. This lets demo visitors explore admin pages with sanitised data
// while keeping write operations strictly behind `adminActionClient`.
// -----------------------------------------------------------------------------
export const demoReadonlyAdminActionClient = userActionClient.use(
  async ({ next, ctx }) => {
    const isAdmin = ctx.user.role === 'admin';
    const isDemo = isDemoWebsite();

    if (!isAdmin && !isDemo) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    return next({ ctx });
  }
);
