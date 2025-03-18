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

const mockSectionsResponse = [
    { id: 1, section: 'Section 1' },
    { id: 2, section: 'Section 2' }
];

const mockDeleteResponse = {
    status: 200
};

test.describe('Sections Admin Panel', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept API requests
        await page.route(`${API_URL}:${API_PORT}/redirect`, async route => {
            await route.fulfill({ json: mockRedirectResponse });
        });

        await page.route(`${API_URL}:${API_PORT}/logout`, async route => {
            await route.fulfill({ json: mockLogoutResponse });
        });

        await page.route(`${API_URL}:${API_PORT}/permission-setting/`, async route => {
            await route.fulfill({ json: mockSectionsResponse });
        });

        await page.route(`${API_URL}:${API_PORT}/permission-setting/1`, async route => {
            await route.fulfill({ json: mockDeleteResponse });
        });

        // Go to the sections page
        await page.goto('/sections');
    });

    test('should render sections admin panel with navigation buttons', async ({ page }) => {
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Új szekció' })).toBeVisible();
        await expect(page.locator('.navbar-link', { hasText: 'Szekciók lista' })).toBeVisible();
        await expect(page.locator('.logout-button')).toBeVisible();
    });

    test('should switch components when navigation buttons are clicked', async ({ page }) => {
        // Click to navigate to "Szekciók lista"
        await page.click('.navbar-link:has-text("Szekciók lista")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Szekciók'); // Check header text

        // Click to navigate to "Új szekció"
        await page.click('.navbar-link:has-text("Új szekció")');
        await page.waitForTimeout(500); // Allow Vue to switch components
        await expect(page.locator('h2.form-title')).toHaveText('Szekció készítés'); // Check header text
    });

    test('should render sections list', async ({ page }) => {
        // Click to go to "Szekciók lista" section
        await page.click('.navbar-link:has-text("Szekciók lista")');

        // Allow Vue to load data (wait for a title or some visible indicator of the component loading)
        await page.waitForTimeout(1000); // Optional delay (adjust if needed)

        // Wait for a title or some visible indicator that the SectionList component is loaded
        await page.waitForSelector('h2.form-title', { state: 'visible', timeout: 8000 }); // Check for title "Szekciók"
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
