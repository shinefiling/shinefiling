import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('CA Dashboard', () => {

    test('Mock CA Login and Dashboard Load', async ({ page }) => {
        await loginAsAdmin(page);

        // Expand CA CRM Menu
        await page.getByText('CA CRM').click();

        // Click Dashboard Submenu
        await page.getByText('Dashboard', { exact: true }).click();

        // Verify Agent/CA Approvals Dashboard loads (AgentApprovals component)
        await expect(page.getByText('Pending')).toBeVisible();
    });

    test('CA Service Configuration', async ({ page }) => {
        await loginAsAdmin(page);

        // Expand CA CRM Menu
        // Use .first() in case multiple matches, though strictly sidebar should be unique
        await page.getByText('CA CRM').first().click();

        // Click Service Config
        await page.getByText('Service Config').click();

        // Verify Service Configuration Tab loads
        await expect(page.getByText('Service Configuration')).toBeVisible();
    });
});
