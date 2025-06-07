const { test, expect } = require('@playwright/test');
test('Mercado Libre Search', async ({ page }) => {
  await page.goto('https://www.mercadolibre.com.mx');
  await page.fill('input[name="as_word"]', 'laptop');
  await page.press('input[name="as_word"]', 'Enter');
  await expect(page.locator('text=Laptops y Accesorios')).toBeVisible(); 
});
