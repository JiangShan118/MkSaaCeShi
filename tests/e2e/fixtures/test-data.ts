export const E2E_TEST_SECRET = 'mksaas-e2e-secret';

export const E2E_USER_PASSWORD = 'Password123456!';

export interface E2EUser {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'user';
}

export function createE2EUser(overrides: Partial<E2EUser> = {}): E2EUser {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    email: `e2e-${suffix}@example.test`,
    name: `E2E User ${suffix}`,
    password: E2E_USER_PASSWORD,
    ...overrides,
  };
}
