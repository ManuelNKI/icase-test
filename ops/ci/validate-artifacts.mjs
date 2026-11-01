import fs from 'node:fs';

const required = ['backend/package.json','frontend/package.json','tests/package.json','ops/docker-compose.yml'];
const missing = required.filter((path) => !fs.existsSync(path));
if (missing.length) {
  console.error('Faltan artefactos aprobados:', missing.join(', '));
  process.exit(1);
}
for (const path of ['backend/icase.manifest.json','frontend/icase.manifest.json','tests/coverage-matrix.json']) JSON.parse(fs.readFileSync(path, 'utf8'));
console.log('Artefactos y manifiestos válidos.');
