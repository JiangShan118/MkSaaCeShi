import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';
import { createE2EUser } from '../fixtures/test-data';

test.describe('authentication and protected routes', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('redirects guests from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('allows a verified user to sign in and view dashboard', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);

    await loginByForm(page, user);
    await expect(page.getByText('Total Revenue')).toBeVisible();
  });

  test('allows a user to register from the register page', async ({
    page,
    request,
  }) => {
    const user = createE2EUser();

    await page.goto('/auth/register');
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(nameInput).toBeVisible();
    await nameInput.fill(user.name);
    await emailInput.fill(user.email);
    await passwordInput.fill(user.password);
    await page.getByRole('button', { name: /^sign up$|^注册$/i }).click();

    await expect(
      page.getByText(/please check your email inbox|请检查您的邮箱/i)
    ).toBeVisible();

    await updateE2EUser(request, {
      email: user.email,
      emailVerified: true,
      role: 'user',
    });
    await loginByForm(page, user);
    await expect(page.getByText('Total Revenue')).toBeVisible();
  });

  test('allows signed-in users to view the demo users dashboard', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);

    await loginByForm(page, user);
    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/admin\/users\/?$/);
    await expect(
      page.getByRole('link', { name: /users|用户管理/i })
    ).toBeVisible();
  });
});
