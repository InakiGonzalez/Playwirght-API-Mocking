// tests/team-management.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('@teamManagement Team Management Flows', () => {
  test.beforeEach(async ({ page, request }) => {
    // 1️⃣ Reset backend & login
    await request.post('/api/test/reset');
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Email' }).fill('ejemplo@tec.mx');
    await page.getByRole('textbox', { name: 'Password' }).fill('123456');
    await page.getByRole('button', { name: /Sign In/ }).click();
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('✏️ Create and delete a team', async ({ page }, testInfo) => {
    testInfo.tags.push('smoke', 'team');  // tag this test

    const teamName = 'Equipo Prueba';

    // 2️⃣ Stub the create-team API
    await page.route('**/api/teams', route =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 100, name: teamName }),
      })
    );

    // 3️⃣ Create
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Team name' }).fill(teamName);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(teamName)).toBeVisible();

    // 4️⃣ Delete (accept native dialog)
    page.once('dialog', d => d.accept());
    await page.getByTitle('Delete team').click();
    await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  });

  test('👥 Add & remove a user from a team', async ({ page }) => {
    // skip on mobile if UI doesn’t support
    test.skip(test.info().project.name === 'Mobile Chrome', 'User-mgmt on mobile not supported');

    // 1. Navigate into the team
    await page.getByText('Equipo Prueba').click();

    // 2. Stub add-user API
    await page.route('**/api/teams/100/users', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ userId: 81 }),
      })
    );

    // 3. Add
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.getByRole('combobox').selectOption('81');
    await page.getByRole('button', { name: 'Add User' }).nth(1).click();
    await expect(page.getByRole('list')).toContainText('Iñaki Gonzalez Morales');

    // 4. Remove
    page.once('dialog', d => d.accept());
    await page
      .getByRole('listitem', { name: /Iñaki Gonzalez Morales/ })
      .getByRole('button')
      .click();
    await expect(page.getByRole('button', { name: 'Add User' })).toBeVisible();
  });
});
