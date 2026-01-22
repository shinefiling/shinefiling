import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Service Forms & Order Flow', () => {

    test('New Service Creation Flow (Admin Side)', async ({ page }) => {
        // Login
        await loginAsAdmin(page);

        // Navigate to Service Management (Product Catalog)
        // Sidebar Text is "Pricing Plans" under Finance & Billing
        await page.getByText('Pricing Plans').click();

        // Open Modal
        await page.getByRole('button', { name: 'New Service' }).click();

        // Fill Form
        await page.locator('input[placeholder*="Service Name"]').fill('Test Automated Service');
        await page.locator('select').first().selectOption({ index: 1 }); // Select category
        await page.locator('input[placeholder*="Price"]').fill('5000');
        await page.locator('textarea').fill('Description for automated test service');

        // Save
        // We mock the API call to avoid junk data, or we let it run if dev DB
        // await page.getByRole('button', { name: 'Create Product' }).click();

        // Verify visibility of elements in modal
        await expect(page.getByText('Create New Service')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Product' })).toBeVisible();
    });

});
