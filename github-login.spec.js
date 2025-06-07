// github-login.spec.js
const { test, expect } = require('@playwright/test');

const fakeUsers = [
  { username: 'fakeuser1', password: 'wrongpass1' },
  { username: 'anotheruser', password: 'badpassword' },
  { username: 'user123', password: '123456' }
];

test.describe('GitHub Login - Parameterized', () => {
  fakeUsers.forEach(({ username, password }) => {
    test(`should show error for invalid user: ${username}`, async ({ page }) => {
      await page.goto('https://github.com/login');
      await page.fill('input[name="login"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('input[name="commit"]');
      // Wait for error message
      const error = page.locator('div[role="alert"]');
      await expect(error).toBeVisible();
      await expect(error).toContainText('Incorrect username or password.');
    });
  });
});


test('test', async ({ page }) => {
  await page.goto('https://github.com/');
  await page.getByRole('link', { name: 'View all', exact: true }).click();
  await page.getByRole('link', { name: 'Software Development' }).click();
  await page.getByRole('link', { name: 'Collections' }).click();
  await page.getByRole('link', { name: 'Learn to Code Learn to Code' }).click();
  await page.getByRole('link', { name: 'freeCodeCamp / freeCodeCamp' }).click();
  await page.getByRole('link', { name: 'Issues 213' }).click();
  await page.getByRole('link', { name: 'New issue' }).click();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
});