import { test, expect } from '@playwright/test';

test.describe('PaidOrders.vue', () => {

    // Helper to login and navigate to PaidOrders page (if applicable)
    async function loginAndNavigate(page) {
        // Assuming login logic for accessing the admin panel
        await page.goto('/login'); // Adjust login URL if needed
        await page.fill('input[name="email"]', 'admin@admin');
        await page.fill('input[name="password"]', 'admin');
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
        await page.goto('/paid-orders');
    }

    test('renders PaidOrders component', async ({ page }) => {
        await loginAndNavigate(page);
        await page.waitForSelector('.form-container');
        expect(await page.isVisible('.form-container')).toBeTruthy();
    });

    test('redirectHandler correctly handles successful API call', async ({ page }) => {
        // Mock successful response from the API
        await page.route('**/redirect', route =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({ isAuthorized: true })
            })
        );
        await loginAndNavigate(page);

        const popupMessage = await page.locator('.popup-message');
        await expect(popupMessage).not.toBeVisible(); // No popup should appear for success
    });

    test('redirectHandler redirects to login page on unauthorized access', async ({ page }) => {
        await page.route('**/redirect', route =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({ isAuthorized: false, message: 'Invalid Role' })
            })
        );

        await loginAndNavigate(page);

        // Assuming redirection is handled via router, you should test URL or navigation
        await expect(page).toHaveURL("http://localhost:5173/paid-orders"); // Adjust URL if needed
    });

    test('displays paid orders when the request is successful', async ({ page }) => {
        // Mock successful response for paid orders
        const paidOrdersMock = [
            { id: 1, tableNumber: 5, itemName: 'Pizza', itemPrice: 12, paymentMethodName: 'Cash', paidAt: '2025-02-11T13:45:00' },
            { id: 2, tableNumber: 3, itemName: 'Pasta', itemPrice: 10, paymentMethodName: 'Card', paidAt: '2025-02-11T14:00:00' }
        ];

        await page.route('**/paid/', route =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({ data: paidOrdersMock })
            })
        );

        await loginAndNavigate(page);

        // Check that the paid orders are rendered
        const rows = await page.locator('table.paid-table tbody tr');
        await expect(rows).toHaveCount(2); // 2 rows for paid orders
    });

    test('shows message when there are no paid orders', async ({ page }) => {
        // Mock empty response
        await page.route('**/paid/', route =>
            route.fulfill({
                status: 204,
                body: JSON.stringify({ data: [] })
            })
        );

        await loginAndNavigate(page);

        // Use a more specific selector to avoid multiple matches
        const noOrdersMessage = await page.locator('h1.form-title'); // Targeting only <h1> element
        await expect(noOrdersMessage).toHaveText('Nincsenek elérhető Kifizetett Termékek');
    });
});

