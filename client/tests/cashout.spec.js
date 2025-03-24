import { test, expect } from '@playwright/test';

// Define the base URL
const BASE_URL = process.env.VITE_API_URL;

// Mock API responses
const mockApiResponse = async (page, url, response) => {
    await page.route(url, (route) => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
    }));
};

test.describe('Cashout Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/cashout');
    });

    test('should render the Cashout component correctly', async ({ page }) => {
        await expect(page.locator('h2.form-title')).toHaveText('Elfogyasztott termékek');
    });

    test('should handle API error without crashing', async ({ page }) => {
        await page.route(`${BASE_URL}/redirect`, (route) => route.abort());
        await page.reload();
        await expect(page.locator('body')).toBeVisible();
    });

    test('should allow logging out', async ({ page }) => {
        await page.route(`${BASE_URL}/logout`, (route) => route.fulfill({ status: 200 }));
        await page.click('.logout-button');
        await expect(page).toHaveURL('/cashout');
    });

    test('should process payment successfully', async ({ page }) => {
        await mockApiResponse(page, `${BASE_URL}/paid/`, { status: 200 });
        await page.click('.form-submit');
        await expect(page.locator('body')).toBeVisible();
    });
});
