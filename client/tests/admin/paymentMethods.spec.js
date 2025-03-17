import { test, expect } from '@playwright/test';

test.describe('PaymentMethods.vue Tests', () => {

    test('should render correct component when button is clicked', async ({ page }) => {
        await page.goto('/payment-methods'); // Replace with actual route

        // Click on the "PaymentMethodAdd" button and ensure the component switches
        await page.click('button:has-text("Új Fizetési mód")');
        await expect(page.locator('h2')).toHaveText('Fizetési mód készítés'); // Check for PaymentMethodAdd component

        // Click on the "PaymentMethodList" button and ensure the component switches
        await page.click('button:has-text("Fizetési módok lista")');
        await expect(page.locator('h2')).toHaveText('Fizetési módok'); // Check for PaymentMethodList component
    });

});
