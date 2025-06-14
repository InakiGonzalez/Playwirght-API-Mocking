# Test info

- Name: @teamNav Team Management & Navigation Flows >> 🆕 Create, Edit & Delete a Team
- Location: /Users/angelgonzaleztorres/Desktop/quality_pepe/tests/team-management.e2e.spec.ts:17:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
<launched> pid=47709
[pid=47709][err] /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 47716 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"
Call log:
  - <launching> /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
  - <launched> pid=47709
  - [pid=47709][err] /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 47716 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"

```

# Test source

```ts
   1 | // tests/team-management-and-navigation.e2e.spec.ts
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | test.describe('@teamNav Team Management & Navigation Flows', () => {
   5 |   test.beforeEach(async ({ page, request }) => {
   6 |     // 🔁 Reset backend state for isolation
   7 |     await request.post('/api/test/reset');
   8 |
   9 |     // 🔑 Log in
  10 |     await page.goto('https://oraclekairo.com/');
  11 |     await page.getByRole('textbox', { name: 'Email' }).fill('ejemplo@tec.mx');
  12 |     await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  13 |     await page.getByRole('button', { name: /Sign In/ }).click();
  14 |     await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();
  15 |   });
  16 |
> 17 |   test('🆕 Create, Edit & Delete a Team', async ({ page }, testInfo) => {
     |       ^ Error: browserType.launch: Target page, context or browser has been closed
  18 |     testInfo.tags.push('smoke', 'team-crud');
  19 |
  20 |     // — Create Team —
  21 |     await page.getByRole('button', { name: '+' }).click();
  22 |     await page.getByRole('textbox', { name: 'Team name' }).fill('Team Prueba');
  23 |     await page.getByRole('button', { name: 'Create', exact: true }).click();
  24 |     await expect(page.getByRole('heading', { name: 'Team Prueba' })).toBeVisible();
  25 |
  26 |     // — Edit Team —
  27 |     await page.getByRole('button', { name: '✏️' }).click();
  28 |     await expect(page.getByRole('heading', { name: 'Edit Team' })).toBeVisible();
  29 |     await page.getByRole('textbox', { name: 'Team Name' }).fill('Team 1');
  30 |     // accept the confirmation dialog
  31 |     page.once('dialog', dialog => dialog.accept());
  32 |     await page.getByRole('button', { name: 'Update' }).click();
  33 |     await expect(page.getByRole('heading', { name: 'Team 1' })).toBeVisible();
  34 |
  35 |     // — Delete Team —
  36 |     page.once('dialog', dialog => dialog.accept());
  37 |     await page.getByRole('button', { name: 'X' }).click();
  38 |     // after deletion, the “+” (create team) button should reappear
  39 |     await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  40 |   });
  41 |
  42 |   test('👥 Add & Remove User then Navigate to Calendar/KPIs', async ({ page }, testInfo) => {
  43 |     testInfo.tags.push('team-users', 'navigation');
  44 |
  45 |     // skip on phones if the UI isn't responsive for user-management there
  46 |     test.skip(testInfo.project.name === 'Mobile Chrome', 'User management not supported on mobile');
  47 |
  48 |     // — Add User —
  49 |     await page.getByText('Usuario de Prueba').click();
  50 |     await page.getByRole('img', { name: 'Usuario de Prueba' }).click();
  51 |     await page.getByRole('button', { name: 'Add User' }).click();
  52 |     await expect(page.getByRole('heading', { name: 'Add User to Team' })).toBeVisible();
  53 |     await page.getByRole('combobox').selectOption('81');          // select “Iñaki…”
  54 |     await page.getByRole('button', { name: 'Add User' }).nth(1).click();
  55 |     await expect(page.getByText('Iñaki Gonzalez Morales')).toBeVisible();
  56 |
  57 |     // — Remove User —
  58 |     page.once('dialog', dialog => dialog.accept());
  59 |     await page
  60 |       .getByRole('listitem', { name: /Iñaki Gonzalez Morales/ })
  61 |       .getByRole('button')
  62 |       .click();
  63 |     await expect(page.getByText('Iñaki Gonzalez Morales')).not.toBeVisible();
  64 |
  65 |     // — Navigate —
  66 |     await page.getByRole('link', { name: 'Calendar' }).click();
  67 |     await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  68 |
  69 |     await page.getByRole('link', { name: 'KPIs' }).click();
  70 |     await expect(page.getByRole('heading', { name: 'KPIs' })).toBeVisible();
  71 |   });
  72 | });
  73 |
```