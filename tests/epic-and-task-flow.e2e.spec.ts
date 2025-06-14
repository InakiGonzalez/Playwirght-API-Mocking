// tests/epic-and-task-flow.e2e.spec.ts
import { test, expect } from '@playwright/test';

// Parameterize two different epics
const epicScenarios = [
  { title: 'Epic Prueba', desc: 'Prueba 1 e2e' },
  { title: 'Otra Epic',  desc: 'Prueba 2 e2e' },
];

test.describe('@epicFlow Epic & Task Workflows', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/test/reset');       // isolation
    await page.goto('/');
    // login
    await page.getByRole('textbox', { name: 'Email' }).fill('ejemplo@tec.mx');
    await page.getByRole('textbox', { name: 'Password' }).fill('123456');
    await page.getByRole('button', { name: /Sign In/ }).click();
    await expect(page.getByRole('button', { name: 'Epics' })).toBeVisible();
  });

  for (const { title, desc } of epicScenarios) {
    test(`📦 Create & delete epic "${title}"`, async ({ page }) => {
      // stub create-epic
      await page.route('**/api/epics', route =>
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 200, title, description: desc }),
        })
      );

      // create
      await page.getByRole('button', { name: 'Epics' }).click();
      await page.getByRole('textbox', { name: 'Título' }).fill(title);
      await page.getByRole('textbox', { name: 'Descripción' }).fill(desc);
      await page.getByRole('button', { name: 'Create Epic' }).click();
      await expect(page.getByText(title)).toBeVisible();

      // delete
      page.once('dialog', d => d.accept());
      await page
        .getByRole('listitem', { name: new RegExp(`^${title}${desc}`) })
        .getByRole('button')
        .first()
        .click();
      await expect(page.getByText(title)).not.toBeVisible();
    });
  }

  test('📝 Create & delete task', async ({ page }) => {
    // stub create-task
    await page.route('**/api/tasks', route =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 300, title: 'Task prueba' }),
      })
    );

    // fill task form
    await page.getByRole('button', { name: 'Create Task' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Task prueba');
    await page.getByRole('textbox', { name: 'Description' }).fill('task de prueba e2e');
    await page.getByLabel('EpicSelecciona un Epic128 -').selectOption('138');
    await page.getByRole('button', { name: 'Create Task' }).click();
    await expect(page.getByText('Task prueba')).toBeVisible();

  });
});
