import { test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
} from '../fixtures/auth';
import {
  expectHealthyPage,
  installPageHealthMonitor,
  localizedPath,
  setTheme,
  type LocaleMode,
  type ThemeMode,
} from '../fixtures/page-health';

const protectedPages = [
  { path: '/dashboard', name: 'dashboard' },
  { path: '/admin/users', name: 'admin users' },
  { path: '/settings/profile', name: 'profile settings' },
  { path: '/settings/security', name: 'security settings' },
  { path: '/settings/apikeys', name: 'api keys settings' },
  { path: '/settings/billing', name: 'billing settings' },
  { path: '/settings/credits', name: 'credits settings' },
  { path: '/settings/notifications', name: 'notification settings' },
  { path: '/payment', name: 'payment result' },
] as const;

const smokeMatrix: Array<{ locale: LocaleMode; theme: ThemeMode }> = [
  { locale: 'en', theme: 'dark' },
  { locale: 'en', theme: 'light' },
  { locale: 'zh', theme: 'dark' },
  { locale: 'zh', theme: 'light' },
];

test.describe('protected page smoke coverage', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  for (const { locale, theme } of smokeMatrix) {
    test(`renders all protected pages in ${locale}/${theme}`, async ({
      page,
      request,
    }) => {
      const user = await registerE2EUser(request, { role: 'admin' });
      await setTheme(page, theme);
      const monitor = installPageHealthMonitor(page);

      await loginByForm(page, user);

      for (const protectedPage of protectedPages) {
        await test.step(protectedPage.name, async () => {
          await expectHealthyPage(
            page,
            monitor,
            localizedPath(protectedPage.path, locale),
            { theme }
          );
        });
      }
    });
  }
});
