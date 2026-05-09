// @ts-check
const { test, expect, defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://localhost',
    ignoreHTTPSErrors: true,
  },
});

test('homepage', async ({ page }) => {
  await page.goto('https://localhost/');
  await expect(page).toHaveTitle('');
});

test('swagger', async ({ page }) => {
  await page.goto('https://localhost/docs');
  await expect(page).toHaveTitle('Hello API Platform - API Platform');
  await expect(page.locator('.operation-tag-content > span')).toHaveCount(76);
});
