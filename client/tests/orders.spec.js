import { test, expect } from '@playwright/test';

test.describe('Order.vue and its components', () => {

    test.beforeEach(async ({ page }) => {
        // Mock API responses if necessary
        await page.route('**/api/orders', async route => {
            await route.fulfill({ json: [{ id: 1, name: 'Order 1' }, { id: 2, name: 'Order 2' }] });
        });

        await page.goto('/orders');
    });

    test('should render Order.vue properly', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Orders');
    });

    test('should load InProcessOrderList.vue with correct data', async ({ page }) => {
        await expect(page.locator('.order-item')).toHaveCount(2);
        await expect(page.locator('.order-item').first()).toContainText('Order 1');
    });

    test('should filter orders based on search input', async ({ page }) => {
        await page.fill('input[placeholder="Search"]', 'Order 1');
        await expect(page.locator('.order-item')).toHaveCount(1);
        await expect(page.locator('.order-item')).toContainText('Order 1');
    });

    test('should show empty state if no orders match search', async ({ page }) => {
        await page.fill('input[placeholder="Search"]', 'Nonexistent');
        await expect(page.locator('.order-item')).toHaveCount(0);
        await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('should navigate to order details when clicking an order', async ({ page }) => {
        await page.click('.order-item:first-child');
        await expect(page).toHaveURL(/order\/1/);
    });

    test('should handle API errors gracefully', async ({ page }) => {
        await page.route('**/api/orders', async route => {
            await route.fulfill({ status: 500, body: 'Internal Server Error' });
        });

        await page.reload();
        await expect(page.locator('.error-message')).toBeVisible();
    });

});
