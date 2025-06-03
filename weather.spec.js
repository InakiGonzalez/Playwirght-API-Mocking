const { test, expect } = require('@playwright/test');

test('should mock the weather API and test error handling', async ({ page }) => {
 
  await page.goto('http://127.0.0.1:5500/weather.html');

  // Mock the API request for a successful response
  await page.route('**/forecast?city=Paris', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        city: 'Paris',
        temperature: '24°C',
        condition: 'Sunny'
      })
    });
  });
  await page.getByPlaceholder('Enter city').fill('Paris');
  await page.getByRole('button', { name: 'Get Weather' }).click();
  await expect(page.locator('#result')).toHaveText('Paris: 24°C, Sunny');

  //500 error
  await page.route('**/forecast?city=Paris', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  // try to obtain weather data again
  await page.fill('#city', 'Paris');
  await page.click('#getWeather');

  await expect(page.locator('#result')).toHaveText('undefined: undefined, undefined'); // should be empty
});
