import type { auth } from './auth';

// https://www.better-auth.com/docs/concepts/typescript#additional-fields
export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;
