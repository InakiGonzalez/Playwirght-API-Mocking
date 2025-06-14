// tests/team-management-and-navigation.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('@teamNav Team Management & Navigation Flows', () => {
  test.beforeAll(({ browserName }) => {
    test.skip(browserName === 'webkit', 'Skipping WebKit locally due to instabilities');
  });
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

  test.afterEach(async ({ request }) => {
    // Ensure no teams linger if a test fails mid-execution
    await request.post('/api/test/reset');
  });

  test('🆕 Create, Edit & Delete a Team', async ({ page }, testInfo) => {
    testInfo.tags.push('smoke', 'team-crud');

    // — Create Team —
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Team name' }).fill('Team Prueba');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Team Prueba' }).first()
    ).toBeVisible();
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
    await page.getByTitle('Delete team').first().click();
    // after deletion, the “+” (create team) button should reappear
    const deletedTeamHeading = page.getByRole('heading', { name: 'Team 1' });
    await expect(deletedTeamHeading).not.toBeVisible();
  });

 
  test('📅 Examine Calendar views', async ({ page }, testInfo) => {
    testInfo.tags.push('calendar');

    // Skip on phones if not responsive
    test.skip(testInfo.project.name === 'Mobile Chrome', 'Calendar view not supported on mobile');

    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();

    // Iterate through several sprints and assert the heading or table content
    const sprints = [
      { label: 'Sprint 4 (OCI) (Oswaldo)', assert: { locator: 'h3', text: 'Sprint 4 (OCI) (Oswaldo)' } },
      { label: 'Sprint 3 (OCI) (Oswaldo)', assert: { role: 'heading', name: 'Sprint 3 (OCI) (Oswaldo)' } },
      { label: 'Sprint 1 (OCI) (Oswaldo)', assert: { locator: 'tbody', contains: '167' } },
      { label: 'Sprint 5 (OCI) (Oswaldo)', assert: { role: 'heading', name: 'Sprint 5 (OCI) (Oswaldo)' } },
      { label: 'Sprint 2 (OCI) (Oswaldo)', assert: { role: 'heading', name: 'Sprint 2 (OCI) (Oswaldo)' } },
    ];

    for (const { label, assert } of sprints) {
      await page.getByText(label).click();

      if (assert.role) {
        await expect(
          page.getByRole(assert.role as any, { name: assert.name! })
        ).toBeVisible();
      } else if (assert.text) {
        await expect(page.locator(assert.locator!)).toHaveText(assert.text);
      } else if (assert.contains) {
        await expect(page.locator(assert.locator!)).toContainText(assert.contains);
      }
    }
  });

  test('📊 Explore KPIs and filters', async ({ page }, testInfo) => {
    testInfo.tags.push('kpis');

    // Navigate to KPI page
    await page.getByRole('link', { name: 'KPIs' }).click();
    await expect(page.getByRole('heading', { name: 'KPIs' })).toBeVisible();

    // Check presence of key KPI sections
    await expect(page.getByRole('heading', { name: 'This is the amount of money' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tasks by Sprint and User' })).toBeVisible();

    // Apply filters via the two comboboxes
    const [sprintSelect, userSelect] = await page.getByRole('combobox').all();
    await expect(sprintSelect).toBeVisible();
    await expect(userSelect).toBeVisible();

    await sprintSelect.selectOption('21');     // e.g. Sprint ID 21
    await userSelect.selectOption('185');      // filter by user 185
    await userSelect.selectOption('241');      // change to user 241

    // Assert that a known cell is visible under those filters
    await expect(
      page.getByRole('cell', { name: 'Implementación de Asignación' })
    ).toBeVisible();
  });
});

