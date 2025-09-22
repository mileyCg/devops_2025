import { test, expect } from '@playwright/test';

test('User can navigate back to dashboard', async ({ page }) => {
    // New Goal Seite öffnen
  await page.goto('http://34.60.163.229/new-goal'); 
  // Zurück zum Dashboard
  await page.click('text=Dashboard');               
  // URL prüfen
  await expect(page).toHaveURL('http://34.60.163.229'); 
});
