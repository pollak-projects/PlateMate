import { test, expect } from '@playwright/test';

const API_URL = process.env.VITE_API_URL || 'http://localhost';
const API_PORT = process.env.VITE_API_PORT || '3000';

// Mock API responses
const mockRedirectResponse = {
    isAuthorized: true
};

const mockLogoutResponse = {
    status: 200
};

test.describe('Admin tables', () => {
    test.beforeEach(async ({ page }) => {

        await page.route(`${API_URL}:${API_PORT}/redirect`, async route => {
            await route.fulfill({ json: mockRedirectResponse });
        });

        await page.route(`${API_URL}:${API_PORT}/logout`, async route => {
            await route.fulfill({ json: mockLogoutResponse });
        });

        // Go to the admin panel page
        await page.goto('/tables');
    });

    test('should render admin panel with navigation buttons', async ({ page }) => {
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Új asztal' })).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Asztalok lista' })).toBeVisible();
        await expect(page.locator('.logout-button')).toBeVisible();
    });

    test('should switch components when navigation buttons are clicked', async ({ page }) => {
        // navigate to "Asztalok lista"
        await page.click('.navbar-link:has-text("Asztalok lista")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Asztalok'); // Check header text

        // navigate to "Új asztal"
        await page.click('.navbar-link:has-text("Új asztal")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Asztal Hozzáadás'); // Check header text
    });

    test('should show mobile menu when hamburger menu is clicked', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(1000); // Ensure UI updates before interacting
        await page.click('.hamburger-menu');
        await page.waitForSelector('.mobile-menu', { state: 'visible' });
    });

    test('should log out user and redirect to login page', async ({ page }) => {
        await page.click('.logout-button');
        await expect(page).toHaveURL('/login');
    });
});
