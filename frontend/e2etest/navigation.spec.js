import { test, expect } from '@playwright/test';

test('User can navigate to New Goal page', async ({ page }) => {
  await page.goto('http://34.60.163.229');
  await page.click('text=New Goal');
  await expect(page).toHaveURL(/new-goal/);
  await expect(page.locator('text=Create New Goal')).toBeVisible();
});
