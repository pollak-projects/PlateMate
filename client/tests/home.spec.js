import { test, expect } from '@playwright/test';

test.describe('Home.vue Component Tests', () => {
    test('should redirect unauthorized users to Login page', async ({ page }) => {
        await page.route('**/redirect?page=home', async (route) => {
            await route.fulfill({ json: { isAuthorized: false } });
        });

        await page.goto('/');
        await expect(page).toHaveURL('/login');
    });

    test('should show correct menu items based on user role', async ({ page }) => {
        await page.route('**/redirect?page=home', async (route) => {
            await route.fulfill({ json: { isAuthorized: true, role: 'admin' } });
        });

        await page.goto('/');

        await expect(page.locator('text=Admin Panel')).toBeVisible();
        await expect(page.locator('text=Foglaláskezelés')).toBeVisible();
        await expect(page.locator('text=Rendelések')).toBeVisible();
        await expect(page.locator('text=Kassza')).toBeVisible();
    });

    test('should not show admin menu for non-admin users', async ({ page }) => {
        await page.route('**/redirect?page=home', async (route) => {
            await route.fulfill({ json: { isAuthorized: true, role: 'cashier' } });
        });

        await page.goto('/');

        await expect(page.locator('text=Admin Panel')).not.toBeVisible();
        await expect(page.locator('text=Kassza')).toBeVisible();
        await expect(page.locator('text=Foglaláskezelés')).not.toBeVisible();
    });

    test('should log out successfully and navigate to Login page', async ({ page }) => {
        await page.route('**/logout', async (route) => {
            await route.fulfill({ status: 200 });
        });

        await page.goto('/');
        await page.click('button.logout-button');

        await expect(page).toHaveURL('/login');
    });

    test('should render branding and footer', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'PlateMate' })).toBeVisible();
        await expect(page.locator('text=Taste the difference')).toBeVisible();
        await expect(page.locator('.footer')).toBeVisible();
    });
});
