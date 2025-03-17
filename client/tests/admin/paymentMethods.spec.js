import { test, expect } from '@playwright/test';

test.describe('PaymentMethods.vue Tests', () => {

    test('should render correct component when button is clicked', async ({ page }) => {
        await page.goto('/payment-methods');

        // Click on the "PaymentMethodAdd"
        await page.click('button:has-text("Új Fizetési mód")');
        await expect(page.locator('h2')).toHaveText('Fizetési mód készítés');

        // Click on the "PaymentMethodList"
        await page.click('button:has-text("Fizetési módok lista")');
        await expect(page.locator('h2')).toHaveText('Fizetési módok');
    });

});
