import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Dashboard Functionality', () => {

    // Login before each test
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('Dashboard Header and Stats Load', async ({ page }) => {
        // Check Header Text
        await expect(page.getByText('Global Control Center')).toBeVisible();

        // Check Key Stats Tiles (using text matching based on MasterDashboard)
        await expect(page.getByText('Total Revenue')).toBeVisible();
        await expect(page.getByText('Active Users')).toBeVisible();
        await expect(page.getByText('Pending Orders')).toBeVisible();
    });

    test('Sidebar Navigation Works', async ({ page }) => {
        // Navigate to Leads CRM
        await page.getByText('Leads CRM').click();
        await expect(page.getByText('Client Directory')).toBeVisible(); // Default tab of Leads CRM

        // Navigate to Operations
        await page.getByText('Operations').click();
        await expect(page.getByText('Global Order Management')).toBeVisible();
    });

    test('Global Order Management Table Loads', async ({ page }) => {
        await page.getByText('Operations').click();

        // Check Table Headers
        await expect(page.getByText(/Order ID/)).toBeVisible();
        await expect(page.getByText('Service Details')).toBeVisible();
        await expect(page.getByText('Client Info')).toBeVisible();

        // Check Search Filters
        await expect(page.getByPlaceholder('Search orders...')).toBeVisible();
    });
});
