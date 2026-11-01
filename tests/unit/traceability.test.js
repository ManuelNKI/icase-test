import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const expected = ["RF-01","RF-02","RF-03","RF-04","RF-05","RF-06","RF-07","RF-08","RF-09","RF-10"];

test('los manifiestos generados mantienen trazabilidad RF', () => {
  const backend = JSON.parse(fs.readFileSync('../backend/icase.manifest.json', 'utf8'));
  const frontend = JSON.parse(fs.readFileSync('../frontend/icase.manifest.json', 'utf8'));
  const actual = new Set([...(backend.requisitos || []).map((item) => item.id), ...(frontend.pantallas || []).flatMap((item) => item.requirements || item.rf || [])]);
  for (const id of expected) assert.ok(actual.has(id), `Falta trazabilidad para ${id}`);
});
