import { test, expect } from '@playwright/test';

test('User can check in a goal', async ({ page }) => {
     // Ziel-Liste öffnen
  await page.goto('http://34.60.163.229/goals'); 
  // Ziel auswählen
  await page.click('text=Mein neues Ziel');     
  // Fortschritt eintragen  
  await page.fill('input[name="progress"]', '20'); 
  // Check-In speichern
  await page.click('text=Save Check-In');          
  // Fortschritt prüfen
  await expect(page.locator('text=20%')).toBeVisible(); 
});

