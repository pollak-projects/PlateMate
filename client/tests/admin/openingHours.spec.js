import { test, expect } from '@playwright/test';

// Helper function to log in and navigate to the page
async function loginAndNavigate(page) {
    // Mock or simulate login and navigation if needed.
    await page.goto('/opening-hours');  // Adjust the URL for your case
}

test.describe('OpeningHours.vue Tests', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndNavigate(page);
    });

    // Test if the OpeningHourAdd and OpeningHourList components render correctly
    test('should render OpeningHourAdd component by default', async ({ page }) => {
        const formTitle = await page.locator('.form-title');
        await expect(formTitle).toHaveText('Termék Létrehozás'); // Check if the OpeningHourAdd component title is visible
    });



    // Test the "Logout" button
    test('should log out successfully and redirect to login page', async ({ page }) => {
        // Mock logout API call
        await page.route('**/logout', route =>
            route.fulfill({ status: 200 })
        );

        // Click on the logout button
        await page.click('button.logout-button');

        // Ensure redirection to the login page
        await expect(page).toHaveURL('/login');
    });
});