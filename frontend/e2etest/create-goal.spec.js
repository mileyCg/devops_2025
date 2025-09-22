import { test, expect } from '@playwright/test';

test('User can create a new goal', async ({ page }) => {
    // New Goal Seite öffnen
  await page.goto('http://34.60.163.229/new-goal');       
  // Neuen Titel
  await page.fill('input[name="goalTitle"]', 'Mein neues Ziel'); 
  // Beschreibung
  await page.fill('textarea[name="description"]', 'Beschreibung'); 
   // Startdatum
  await page.fill('input[name="startDate"]', '2025-09-22');
  // Enddatum
  await page.fill('input[name="endDate"]', '2025-10-22');   
   // Button klicken
  await page.click('text=Create New Goal');              
   // Ziel prüfen
  await expect(page.locator('text=Mein neues Ziel')).toBeVisible(); 
});
