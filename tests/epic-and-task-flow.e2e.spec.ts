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

      page.once('dialog', d => d.accept());

      const epicContainer = page.getByRole('listitem').filter({ hasText: title });
      await epicContainer.getByRole('button', {name: 'Eliminar'}).click();

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
    
    // Epic dropdown
    await page.getByRole('combobox', { name: 'Epic' }).selectOption('138');
    
    // Priority dropdown
    await page.locator('select[name="priority"]').selectOption('High');

    // Type dropdown
    await page.locator('select[name="type"]').selectOption('Feature');
    
    // Fechas (después de 2026)
    await page.locator('input[name="estimatedDeadline"]').fill('2027-01-15');
    await page.locator('input[name="realDeadline"]').fill('2027-02-15');
    
    // Números
    await page.getByRole('spinbutton', { name: 'Estimated Hours' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Real Hours' }).fill('10');
    await page.getByRole('spinbutton', { name: 'User Points' }).fill('5');
    
    // Submit
    await page.locator('button[type="submit"]').click();

    // ✅ VERIFICAR QUE SE CREÓ
    await page.getByText('All Tasks').click();

    // Esperar que la tarea aparezca en la lista
    await expect(page.getByText('Task prueba')).toBeVisible();

    // ✅ ABRIR FORMULARIO EDIT/DELETE
    await page.getByRole('button', { name: 'Edit/Delete Tasks' }).click();
    
    // ✅ SELECCIONAR LA TASK EN EL DROPDOWN
    await page.locator('select.select-bordered').selectOption({ label: 'Task prueba' });
    
    // ✅ ELIMINAR LA TASK
    page.once('dialog', d => d.accept()); // Para confirmar eliminación
    await page.locator('button.btn.btn-error').click(); // Botón rojo específico
    
    await page.getByText('All Tasks').click();

  });
});
