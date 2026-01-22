// Common helper functions for Playwright tests

export async function loginAsAdmin(page) {
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('admin@shinefiling.com'); // Using email format to satisfy type="email"
    await page.locator('input[name="password"]').fill('admin'); // Password from DataInitializer
    await page.getByRole('button', { name: 'Login Securely' }).click();
    // Wait for navigation and verify
    await page.waitForURL(/\/admin/);
}

export async function navigateToSidebarItem(page, name) {
    await page.getByText(name).click();
}
