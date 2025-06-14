# Test info

- Name: @teamManagement Team Management Flows >> ✏️ Create and delete a team
- Location: /Users/angelgonzaleztorres/Desktop/quality_pepe/tests/team-management.e2e.spec.ts:15:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
<launched> pid=33533
[pid=33533][err] /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 33541 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"
Call log:
  - <launching> /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
  - <launched> pid=33533
  - [pid=33533][err] /Users/angelgonzaleztorres/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 33541 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"

```

# Test source

```ts
   1 | // tests/team-management.e2e.spec.ts
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | test.describe('@teamManagement Team Management Flows', () => {
   5 |   test.beforeEach(async ({ page, request }) => {
   6 |     // 1️⃣ Reset backend & login
   7 |     await request.post('/api/test/reset');
   8 |     await page.goto('/');
   9 |     await page.getByRole('textbox', { name: 'Email' }).fill('ejemplo@tec.mx');
  10 |     await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  11 |     await page.getByRole('button', { name: /Sign In/ }).click();
  12 |     await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  13 |   });
  14 |
> 15 |   test('✏️ Create and delete a team', async ({ page }, testInfo) => {
     |       ^ Error: browserType.launch: Target page, context or browser has been closed
  16 |     testInfo.tags.push('smoke', 'team');  // tag this test
  17 |
  18 |     const teamName = 'Equipo Prueba';
  19 |
  20 |     // 2️⃣ Stub the create-team API
  21 |     await page.route('**/api/teams', route =>
  22 |       route.fulfill({
  23 |         status: 201,
  24 |         contentType: 'application/json',
  25 |         body: JSON.stringify({ id: 100, name: teamName }),
  26 |       })
  27 |     );
  28 |
  29 |     // 3️⃣ Create
  30 |     await page.getByRole('button', { name: '+' }).click();
  31 |     await page.getByRole('textbox', { name: 'Team name' }).fill(teamName);
  32 |     await page.getByRole('button', { name: 'Create' }).click();
  33 |     await expect(page.getByText(teamName)).toBeVisible();
  34 |
  35 |     // 4️⃣ Delete (accept native dialog)
  36 |     page.once('dialog', d => d.accept());
  37 |     await page.getByTitle('Delete team').click();
  38 |     await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  39 |   });
  40 |
  41 |   test('👥 Add & remove a user from a team', async ({ page }) => {
  42 |     // skip on mobile if UI doesn’t support
  43 |     test.skip(test.info().project.name === 'Mobile Chrome', 'User-mgmt on mobile not supported');
  44 |
  45 |     // 1. Navigate into the team
  46 |     await page.getByText('Equipo Prueba').click();
  47 |
  48 |     // 2. Stub add-user API
  49 |     await page.route('**/api/teams/100/users', route =>
  50 |       route.fulfill({
  51 |         status: 200,
  52 |         contentType: 'application/json',
  53 |         body: JSON.stringify({ userId: 81 }),
  54 |       })
  55 |     );
  56 |
  57 |     // 3. Add
  58 |     await page.getByRole('button', { name: 'Add User' }).click();
  59 |     await page.getByRole('combobox').selectOption('81');
  60 |     await page.getByRole('button', { name: 'Add User' }).nth(1).click();
  61 |     await expect(page.getByRole('list')).toContainText('Iñaki Gonzalez Morales');
  62 |
  63 |     // 4. Remove
  64 |     page.once('dialog', d => d.accept());
  65 |     await page
  66 |       .getByRole('listitem', { name: /Iñaki Gonzalez Morales/ })
  67 |       .getByRole('button')
  68 |       .click();
  69 |     await expect(page.getByRole('button', { name: 'Add User' })).toBeVisible();
  70 |   });
  71 | });
  72 |
```