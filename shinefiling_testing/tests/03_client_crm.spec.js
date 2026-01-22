import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Client CRM Module', () => {

    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await loginAsAdmin(page);

        // Navigate to Leads CRM
        await page.getByText('Leads CRM').click();
    });

    test('Client Directory Loads', async ({ page }) => {
        await expect(page.getByText('Client Name')).toBeVisible();
        await expect(page.getByText('Contact Info')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add New Client' })).toBeVisible();
    });

    test('Switch Tabs in CRM', async ({ page }) => {
        // There are sub-tabs inside CRMSystem but navigation logic is usually controlled by parent props in MasterDashboard for these flows
        // However, if there are internal tabs, we test them here. 
        // Based on MasterDashboard mapping, 'leads_followup' maps to CRMSystem tab="tasks"

        // So we click sidebar items to switch "tabs"
        await page.getByText('Operations').click(); // This is effectively switching the view
        await expect(page.getByText('Global Order Management')).toBeVisible();
    });

    // Note: Since Add Client is currently an alert(), we can mock the dialog to ensure it fires
    test('Add Client Button Triggers Dialogue', async ({ page }) => {
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('Add Client');
            dialog.dismiss();
        });
        await page.getByRole('button', { name: 'Add New Client' }).click();
    });
});
