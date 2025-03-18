import { test, expect } from '@playwright/test';

test.describe('Admin Items', () => {

    test('should switch components when navigation buttons are clicked', async ({ page }) => {
        await page.goto('http://localhost:5173/items'); // Update URL if necessary

        // Click "Új Termék" and verify ItemAdd component is displayed
        await page.click('.navbar-link:has-text("Új Termék")');
        await page.waitForTimeout(500);
        await expect(page.locator('h2.form-title')).toHaveText('Termék Létrehozás');

        // Click "Termékek lista" and verify ItemList component is displayed
        await page.click('.navbar-link:has-text("Termékek lista")');
        await page.waitForTimeout(500);
        await expect(page.locator('h2.form-title')).toHaveText('Termékek');
    });


    test('should display items and allow deletion', async ({ page }) => {
        await page.goto('http://localhost:5173/items');

        await page.click('.navbar-link:has-text("Termékek lista")');
        await page.waitForTimeout(500);

        const itemRows = page.locator('tbody tr');
        const initialCount = await itemRows.count();

        if (initialCount > 0) {
            await page.click('tbody tr:first-child .delete-button');
            await expect(page.locator('.popup-message')).toHaveText('Sikeres törlés!');
        }
});
});
