const { test, expect } = require('@playwright/test');

test('should mock Harry Potter API, modify/add/remove characters', async ({ page }) => {
  // array "completo"
  const data = [
    { attributes: { name: 'Harry Potter', house: 'Gryffindor' } },
    { attributes: { name: 'Iñaki González', house: 'Gryffindor' } },
    { attributes: { name: 'Hermione Granger', house: 'Gryffindor' } }
  ];

  // 2.quitamos a Harry
  const filtered = data.filter(item => item.attributes.name !== 'Harry Potter');

  // 3. Mock a la respuesta de la API con los datos filtrados
  await page.route('**/characters**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: filtered })
    });
  });

  // 4. Visitamos la url DESPUÉS de hacer el mock para que no se haga la petición real
  await page.goto('http://127.0.0.1:5500/harry-potter-list.html');

  // 5. asserts
  await page.waitForSelector('#userList li');
  const items = await page.$$eval('#userList li', nodes => nodes.map(n => n.textContent));
  expect(items).not.toContain('Harry Potter - Gryffindor');
  expect(items).toContain('Iñaki González - Gryffindor');
  expect(items).toContain('Hermione Granger - Gryffindor');

});



test('should mock with HAR file', async ({ page }) => {
  await page.routeFromHAR('harry.har', { update: false }); // primero usamos routeFromHAR para cargar el HAR
  await page.goto('http://127.0.0.1:5500/harry-potter-list.html');
  await page.waitForSelector('#userList li');
  const items = await page.$$eval('#userList li', nodes => nodes.map(n => n.textContent));
  expect(items).toContain('Hermione Granger - Gryffindor'); // probamos con nuestros datos reemplazados en el HAR
});

