import test from 'node:test';
import assert from 'node:assert/strict';

test('el backend responde su comprobación de salud', async () => {
  const base = process.env.BASE_API_URL || 'http://localhost:3000';
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
});
