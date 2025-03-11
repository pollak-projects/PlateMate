import { test, expect } from '@playwright/test';

// Define environment variables for API URL and PORT
const API_URL = process.env.VITE_API_URL || 'http://localhost';
const API_PORT = process.env.VITE_API_PORT || '3000';

// Mock API responses
const mockRedirectResponse = {
    isAuthorized: true
};

const mockLogoutResponse = {
    status: 200
};

test.describe('Admin users panel', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept API requests
        await page.route(`${API_URL}:${API_PORT}/redirect`, async route => {
            await route.fulfill({ json: mockRedirectResponse });
        });

        await page.route(`${API_URL}:${API_PORT}/logout`, async route => {
            await route.fulfill({ json: mockLogoutResponse });
        });

        // Go to the admin panel page
        await page.goto('/users');
    });

    test('should render admin panel with navigation buttons', async ({ page }) => {
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Új felhasználó' })).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Felhasználók lista' })).toBeVisible();
        await expect(page.locator('.logout-button')).toBeVisible();
    });

    test('should switch components when navigation buttons are clicked', async ({ page }) => {
        // Click to navigate to "Felhasználók lista"
        await page.click('.navbar-link:has-text("Felhasználók lista")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Felhasználók'); // Check header text

        // Click to navigate to "Új felhasználó"
        await page.click('.navbar-link:has-text("Új felhasználó")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Felhasználó Létrehozás'); // Check header text
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
