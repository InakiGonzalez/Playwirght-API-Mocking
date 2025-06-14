// tests/oraclekairo.spec.ts
import { test, expect } from '@playwright/test';
import { login } from './utils/auth';
import { navigateTo } from './utils/nav';

test.describe('OracleKairo E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://oraclekairo.com/');
    await login(page, { email: 'lorena@tec.mx', password: '123456' });
  });

  test('smoke: landing shows Teams and can open All Tasks', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Teams', level: 2 })).toBeVisible();
    await navigateTo(page, 'All Tasks');
    await expect(page).toHaveURL(/all-tasks/);
  });

  test('CRUD Epics', async ({ page }) => {
    // open Epics modal
    await navigateTo(page, 'Epics');
    // fill & submit
    await page.fill('input[name="Título"]', 'Epic Prueba');
    await page.fill('textarea[name="Descripción"]', 'epic prueba 1');
    await page.click('button:has-text("Create Epic")');
    // assert it appears
    await expect(page.locator('.epic-item')).toContainText('Epic Prueba');

    // edit & delete
    await page.click('.epic-item >> button:has-text("Editar")');
    await page.fill('.epic-item input[name="Descripción"]', 'epic prueba updated');
    await page.click('button:has-text("Guardar")');
    await page.click('.epic-item >> button:has-text("Eliminar")');
    await expect(page.locator('.epic-item')).not.toContainText('Epic Prueba');
  });

  test('CRUD Tasks', async ({ page }) => {
    await navigateTo(page, 'Create Task');
    // use helper
    await page.fill('input[name="Title"]', 'Task prueba');
    await page.fill('textarea[name="Description"]', 'Task 1 e2e');
    await page.selectOption('select[name="EpicSelecciona un Epic123 -"]', '123');
    await page.selectOption('select[name="priority"]', 'Low');
    await page.selectOption('select[name="type"]', 'Ticket');
    await page.fill('input[name="estimatedDeadline"]', '2025-06-14');
    await page.fill('input[name="estimatedHours"]', '1');
    await page.fill('input[name="userPoints"]', '2');
    await page.click('button:has-text("Create Task")');

    await navigateTo(page, 'All Tasks');
    await expect(page.getByText('Task prueba')).toBeVisible();
  });

  
  // …and so on for Assign/Unassign, Edit/Delete Tasks, navigation checks, logout, etc.
});
