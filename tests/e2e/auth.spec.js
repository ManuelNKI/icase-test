import { test, expect } from '@playwright/test';

const credentials = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
const heading = (page) => page.getByRole('heading', { name: 'Iniciar sesión' });
async function signIn(page, password = credentials.password) {
  await page.goto("/GourmetFlow / Flujo de Cliente / Pantalla de Inicio y Menú Digital / Vista de Detalle de Platillo");
  await page.getByLabel('Correo electrónico').fill(credentials.email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
}

test('sin sesión se pide iniciar sesión y las credenciales incorrectas se rechazan', async ({ page }) => {
  await signIn(page, 'contraseña-incorrecta');
  await expect(heading(page)).toBeVisible();
  await expect(page.getByRole('alert')).toContainText(/credenciales/i);
});

test('iniciar y cerrar sesión desde la interfaz', async ({ page }) => {
  await signIn(page);
  await expect(page.locator('[data-screen]')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(heading(page)).toBeVisible();
  expect(await page.evaluate(() => window.localStorage.getItem('icase_token'))).toBeNull();
});

test('el administrador accede a la gestión de usuarios', async ({ page }) => {
  await signIn(page);
  await page.getByRole('link', { name: 'Usuarios' }).click();
  await expect(page.locator('[data-screen="usuarios"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Usuarios', exact: true })).toBeVisible();
});
