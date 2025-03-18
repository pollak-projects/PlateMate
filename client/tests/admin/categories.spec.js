import { test, expect } from '@playwright/test';

test.describe('Categories.vue tests', () => {
    test('should navigate between CategoryAdd and CategoryList', async ({ page }) => {
        await page.goto('/categories');

        await page.click('text=Új kategória');
        await expect(page.locator('h2')).toHaveText('Kategória készítés');

        await page.click('text=Kategóriák lista');
        await expect(page.locator('h2')).toHaveText('Kategóriák');
    });

});
