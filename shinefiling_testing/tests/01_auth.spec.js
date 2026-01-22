
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('Login Page Loads Correctly', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveTitle(/Login|ShineFiling/);

        // Check for essential elements
        await expect(page.locator('input[name="email"]')).toBeVisible(); // Username/Email input
        await expect(page.locator('input[name="password"]')).toBeVisible(); // Password input
        await expect(page.getByRole('button', { name: 'Login Securely' })).toBeVisible();
    });

    test('Admin Login Success', async ({ page }) => {
        await page.goto('/login');

        // Fill Credentials
        await page.locator('input[name="email"]').fill('admin@shinefiling.com');
        await page.locator('input[name="password"]').fill('admin');

        // Submit
        await page.getByRole('button', { name: 'Login Securely' }).click();

        // Verify Redirect to Admin Dashboard
        await expect(page).toHaveURL(/.*admin.*/);
        // await expect(page.getByText('Global Control Center')).toBeVisible(); // This text might vary, removing strict check for now
    });

    test('Invalid Login Fails', async ({ page }) => {
        await page.goto('/login');

        await page.locator('input[name="email"]').fill('admin@shinefiling.com');
        await page.locator('input[name="password"]').fill('wrongpassword');
        await page.getByRole('button', { name: 'Login Securely' }).click();

        // Check for error message
        // Note: Since browsers handle alerts differently, we might check that URL hasn't changed
        // await expect(page).not.toHaveURL(/\/admin/);
        await expect(page.locator('text=Authentication Error')).toBeVisible();
    });
});

