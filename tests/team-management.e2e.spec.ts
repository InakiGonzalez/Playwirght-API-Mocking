// tests/team-management-and-navigation.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('@teamNav Team Management & Navigation Flows', () => {
  test.beforeEach(async ({ page, request }) => {
    // 🔁 Reset backend state for isolation
    await request.post('/api/test/reset');

    // 🔑 Log in
    await page.goto('https://oraclekairo.com/');
    await page.getByRole('textbox', { name: 'Email' }).fill('ejemplo@tec.mx');
    await page.getByRole('textbox', { name: 'Password' }).fill('123456');
    await page.getByRole('button', { name: /Sign In/ }).click();
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();
  });

  test('🆕 Create, Edit & Delete a Team', async ({ page }, testInfo) => {
    testInfo.tags.push('smoke', 'team-crud');

    // — Create Team —
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Team name' }).fill('Team Prueba');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Team Prueba' })).toBeVisible();

    // — Edit Team —
    await page.getByRole('button', { name: '✏️' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Team' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Team Name' }).fill('Team 1');
    // accept the confirmation dialog
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByRole('heading', { name: 'Team 1' })).toBeVisible();

    // — Delete Team —
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'X' }).click();
    // after deletion, the “+” (create team) button should reappear
    await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  });

  test('👥 Add & Remove User then Navigate to Calendar/KPIs', async ({ page }, testInfo) => {
    testInfo.tags.push('team-users', 'navigation');

    // skip on phones if the UI isn't responsive for user-management there
    test.skip(testInfo.project.name === 'Mobile Chrome', 'User management not supported on mobile');

    // — Add User —
    await page.getByText('Usuario de Prueba').click();
    await page.getByRole('img', { name: 'Usuario de Prueba' }).click();
    await page.getByRole('button', { name: 'Add User' }).click();
    await expect(page.getByRole('heading', { name: 'Add User to Team' })).toBeVisible();
    await page.getByRole('combobox').selectOption('81');          // select “Iñaki…”
    await page.getByRole('button', { name: 'Add User' }).nth(1).click();
    await expect(page.getByText('Iñaki Gonzalez Morales')).toBeVisible();

    // — Remove User —
    page.once('dialog', dialog => dialog.accept());
    await page
      .getByRole('listitem', { name: /Iñaki Gonzalez Morales/ })
      .getByRole('button')
      .click();
    await expect(page.getByText('Iñaki Gonzalez Morales')).not.toBeVisible();

    // — Navigate —
    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();

    await page.getByRole('link', { name: 'KPIs' }).click();
    await expect(page.getByRole('heading', { name: 'KPIs' })).toBeVisible();
  });
});
