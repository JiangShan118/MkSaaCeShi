import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
} from '../fixtures/auth';

test.describe('settings profile', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('updates the signed-in user display name', async ({ page, request }) => {
    const user = await registerE2EUser(request);
    const newName = `E2E Updated ${Date.now().toString().slice(-6)}`;

    await loginByForm(page, user);
    await page.goto('/settings/profile');

    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /save|保存/i }).click();

    await expect(
      page.getByText(/name updated successfully|名字更新成功/i)
    ).toBeVisible();
    await expect(nameInput).toHaveValue(newName);

    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue(newName);
  });
});
