import { test, expect } from '@playwright/test';

const apiBase = process.env.BASE_API_URL || 'http://localhost:3000';
let token = '';
test.beforeAll(async () => {
  const response = await fetch(apiBase + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }) });
  expect(response.ok, 'No se pudo iniciar sesión con ADMIN_EMAIL y ADMIN_PASSWORD').toBeTruthy();
  token = (await response.json()).token;
});
test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => window.localStorage.setItem('icase_token', value), token);
});

const routes = ["/GourmetFlow / Flujo de Cliente / Pantalla de Inicio y Menú Digital / Vista de Detalle de Platillo","/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Formulario de Reserva de Mesa o Silla","/GourmetFlow / Flujo de Cliente / Módulo de Reservas / Vista de Código QR Generado","/GourmetFlow / Flujo de Cliente / Módulo de Paquetes / Vista de Compra de Paquetes Semanales","/GourmetFlow / Flujo de Cliente / Módulo de Fidelización / Vista de Saldo de Puntos","/GourmetFlow / Flujo de Personal de Cocina / Panel de Cocina en Tiempo Real / Vista de Gestión de Platos Agotados","/GourmetFlow / Flujo de Mesero / Panel de Mesas Asignadas / Formulario de Registro de Pedidos","/GourmetFlow / Flujo de Mesero / Vista de Escaneo QR / Pantalla de Validación de Reserva","/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Formulario de Procesamiento de Cobro","/GourmetFlow / Flujo de Caja / Panel de Cobros y Planes / Vista de Validación de Plan Prepagado","/GourmetFlow / Flujo de Administrador / Panel de Administración / Vista de Reportes de Ventas","/GourmetFlow / Flujo de Administrador / Panel de Administración / Formulario de Gestión de Precios del Menú"];
for (const route of routes) {
  test(`renderiza ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('[data-screen]')).toBeVisible();
  });
}
