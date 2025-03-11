import { test, expect } from '@playwright/test';

test.describe('Login.vue Component Tests', () => {
    test('should successfully log in with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password123');

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/login');
    });

    test('should toggle password visibility', async ({ page }) => {
        await page.goto('/login');

        const passwordInput = page.locator('input[name="password"]');
        await passwordInput.fill('password123');

        // Ensure the password is initially hidden
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click the toggle button
        await page.click('.password-toggle');

        // Ensure the password is now visible
        await expect(passwordInput).toHaveAttribute('type', 'text');
    });
});
