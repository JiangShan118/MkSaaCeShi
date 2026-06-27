import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: [
      `PORT=${port}`,
      `NEXT_PUBLIC_BASE_URL=${baseURL}`,
      'NEXT_PUBLIC_DEMO_WEBSITE=true',
      'NEXT_PUBLIC_E2E_TEST_MODE=true',
      'NEXT_PUBLIC_PAYMENT_PROVIDER=stripe',
      'NEXT_DIST_DIR=.next-e2e',
      'BETTER_AUTH_SECRET=e2e-better-auth-secret',
      'E2E_TEST_SECRET=mksaas-e2e-secret',
      'pnpm dev',
    ].join(' '),
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
