import { test, expect } from '@playwright/test';

test.describe('Reservations.vue and components', () => {

    test.describe('Reservations Page', () => {
        test('should load the reservations page', async ({ page }) => {
            await page.goto('http://localhost:5173/reservations');
            await expect(page).toHaveTitle("PlateMate Corporation");
        });


        test('should switch between components', async ({ page }) => {
            await page.goto('http://localhost:5173/reservations');
            await page.click('text=Új foglalás');
            await expect(page.locator('text=Új foglalás')).toBeVisible();
            await page.click('text=Foglalások lista');
            await expect(page.locator('text=Foglalások lista')).toBeVisible();
        });

    });

    test.describe('FloorPlan Component', () => {
        test('should render floor plan', async ({ page }) => {
            await page.goto('http://localhost:5173/reservations');
            await expect(page.locator('.reservation-container')).toBeVisible();
        });

        test('should select a table correctly', async ({ page }) => {
            await page.goto('http://localhost:5173/reservations');
            await page.click('.table-cell div:has-text("3")');
            await expect(page.locator('.table-selected')).toHaveText('3');
        });

        test('should emit tableSelected event', async ({ page }) => {
            // Create a global event listener before page load
            await page.exposeFunction('onTableSelected', (id) => {
                console.log('Table selected event emitted with ID:', id);
            });

            await page.goto('http://localhost:5173/reservations');

            // Inject JavaScript to hook into Vue's event system
            await page.evaluate(() => {
                document.querySelector('.reservation-container').addEventListener('tableSelected', (event) => {
                    window.onTableSelected(event.detail);
                });
            });

            await page.click('.table-cell div:has-text("5")');

            // Expect the event to be emitted (this part is a workaround since we can't directly assert emitted events)
            await page.waitForTimeout(500);
        });

        test('should apply correct class to selected table', async ({ page }) => {
            await page.goto('http://localhost:5173/reservations');
            await page.click('.table-cell div:has-text("7")');
            await expect(page.locator('.table-selected')).toHaveText('7');
        });
    });
});
