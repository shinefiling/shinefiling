import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ShineFiling|Login/);
});

test('login page loads elements', async ({ page }) => {
    await page.goto('/login');

    // Check if the get started button or login form is visible
    // Adjust these locators based on your actual Login.jsx
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});
