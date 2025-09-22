import { test, expect } from '@playwright/test';

test('Goal form validation works', async ({ page }) => {
    // New Goal Seite öffnen
  await page.goto('http://34.60.163.229/new-goal'); 
  // Ohne Eingabe auf Button klicken
  await page.click('text=Create New Goal');         
  // Fehlermeldung prüfen
  await expect(page.locator('text=Title is required')).toBeVisible(); 
});

