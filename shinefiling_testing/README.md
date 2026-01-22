# ShineFiling Testing Suite

This folder contains the End-to-End (E2E) automated tests for the ShineFiling application, using [Playwright](https://playwright.dev/).

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Install Playwright Browsers:**
    ```bash
    npx playwright install
    ```

## Running Tests

*   **Run all tests:**
    ```bash
    npm test
    ```
    or
    ```bash
    npx playwright test
    ```

*   **Run tests with UI mode (Interactive):**
    ```bash
    npm run test:ui
    ```

*   **Debug tests:**
    ```bash
    npm run test:debug
    ```

*   **View Report:**
    After running tests, a report is generated. You can view it with:
    ```bash
    npx playwright show-report
    ```

## Project Structure

*   `tests/`: Contains the test files (`.spec.js`).
*   `playwright.config.js`: Configuration file for Playwright (Base URL, browsers, timeouts).
*   `package.json`: Dependencies and scripts.

## Writing Tests

Create new `.spec.js` files in the `tests/` directory.

Example:
```javascript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/ShineFiling/);
});
```
