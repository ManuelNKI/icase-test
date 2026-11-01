import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.BASE_API_URL || 'http://localhost:3000';

function salted() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function samplePayload(schema, rules, salt) {
  rules = rules || [];
  salt = String(salt || 'a1b2');
  const properties = (schema && schema.properties) || {};
  const day = 86400000;
  const ruleFor = (type, field) => rules.find((rule) => rule.tipo === type && rule.campo === field);
  const defaulted = new Set(rules.filter((rule) => rule.tipo === 'valor_por_defecto').map((rule) => rule.campo));
  const unique = (field) => rules.some((rule) => rule.tipo === 'unico' && rule.campos.includes(field));
  const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
  const shift = (value, steps) => {
    if (typeof value === 'number') return value + steps;
    if (isDate(value)) {
      const moved = new Date(Date.parse(value) + steps * day);
      return value.length === 10 ? moved.toISOString().slice(0, 10) : moved.toISOString();
    }
    return steps === 0 ? value : value + '-x';
  };
  const hex = (size) => Array.from({ length: size }, () => randomInt(0, 15).toString(16)).join('');

  const payload = {};
  const parents = [];
  for (const [name, property] of Object.entries(properties)) {
    if (property.readOnly) continue;
    if (property['x-references']) {
      if (ruleFor('requerido', name)) parents.push({ campo: name, entidad: property['x-references'] });
      continue;
    }
    if (defaulted.has(name)) continue;
    const machine = ruleFor('maquina_estados', name);
    const range = ruleFor('rango', name);
    const length = ruleFor('longitud', name);
    const format = ruleFor('formato', name);
    let value;
    if (machine) value = machine.inicial;
    else if (property.enum && property.enum.length) value = property.enum[0];
    else if (property.type === 'integer' || property.type === 'number') {
      const low = range && range.min !== undefined ? range.min : undefined;
      const high = range && range.max !== undefined ? range.max : undefined;
      const integer = property.type === 'integer';
      if (unique(name)) {
        const from = low !== undefined ? low : 1;
        const to = high !== undefined ? high : from + 1000000;
        value = integer ? randomInt(Math.ceil(from), Math.floor(to)) : Math.round((from + Math.random() * (to - from)) * 100) / 100;
      } else {
        value = integer ? 7 : 1.5;
        if (low !== undefined && value < low) value = integer ? Math.ceil(low) : low;
        if (high !== undefined && value > high) value = integer ? Math.floor(high) : high;
      }
    } else if (property.type === 'boolean') value = true;
    else if (property.type === 'array') value = [];
    else if (property.format === 'date-time') value = new Date(Date.UTC(2030, 0, 2, 3, 4, 5) + (unique(name) ? randomInt(0, 3650) * day : 0)).toISOString();
    else if (property.format === 'date') value = new Date(Date.UTC(2030, 0, 2) + (unique(name) ? randomInt(0, 3650) * day : 0)).toISOString().slice(0, 10);
    else if (property.format === 'time') value = '03:04:05';
    else if (property.format === 'uuid') value = unique(name) ? `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}` : '123e4567-e89b-42d3-a456-426614174000';
    else if (format) value = format.formato === 'email' ? `usuario-${salt}@example.com` : `https://example.com/${salt}`;
    else {
      value = 'valor-' + name + (unique(name) ? '-' + salt : '');
      if (length && length.max !== undefined && value.length > length.max) value = value.slice(value.length - length.max);
      if (length && length.min !== undefined && value.length < length.min) value = 'x'.repeat(length.min - value.length) + value;
    }
    payload[name] = value;
  }

  const relation = (rule, violate) => {
    const right = rule.con_campo !== undefined ? payload[rule.con_campo] : rule.con_valor;
    if (right === undefined || payload[rule.campo] === undefined) return undefined;
    const steps = {
      '<': violate ? 0 : -1, '<=': violate ? 1 : 0, '>': violate ? 0 : 1, '>=': violate ? -1 : 0, '==': violate ? 1 : 0, '!=': violate ? 0 : 1
    }[rule.operador];
    return shift(right, steps);
  };
  for (const rule of rules.filter((item) => item.tipo === 'comparacion')) {
    const adjusted = relation(rule, false);
    if (adjusted !== undefined) payload[rule.campo] = adjusted;
  }

  const typed = Object.entries(payload).map(([name, value]) => ({ name, type: properties[name].type, format: properties[name].format || null, value }));
  const defaults = rules.filter((rule) => rule.tipo === 'valor_por_defecto').map((rule) => ({ campo: rule.campo, valor: rule.valor }));

  const cases = [];
  const last = [];
  for (const rule of rules) {
    const field = rule.campo;
    const base = { regla: rule.id, tipo: rule.tipo };
    if (rule.tipo === 'requerido' && (payload[field] !== undefined || parents.some((parent) => parent.campo === field))) cases.push({ ...base, accion: 'crear', omitir: [field], esperado: 422 });
    if (rule.tipo === 'rango' && payload[field] !== undefined) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: rule.max !== undefined ? rule.max + 1 : rule.min - 1 }, esperado: 422 });
    if (rule.tipo === 'longitud' && payload[field] !== undefined) {
      if (rule.max !== undefined) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: 'x'.repeat(rule.max + 1) }, esperado: 422 });
      else if (rule.min > 1) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: 'x'.repeat(rule.min - 1) }, esperado: 422 });
    }
    if (rule.tipo === 'formato' && payload[field] !== undefined) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: 'no-valido' }, esperado: 422 });
    if (rule.tipo === 'comparacion') {
      const violating = relation(rule, true);
      if (violating !== undefined) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: violating }, esperado: 422 });
    }
    if (rule.tipo === 'unico' && rule.campos.every((item) => payload[item] !== undefined)) cases.push({ ...base, accion: 'duplicar', esperado: 409 });
    if (rule.tipo === 'inmutable' && payload[field] !== undefined && !Array.isArray(payload[field])) {
      const changed = typeof payload[field] === 'boolean' ? !payload[field] : shift(payload[field], 1);
      cases.push({ ...base, accion: 'modificar', cuerpo: { [field]: changed }, esperado: 422 });
    }
    if (rule.tipo === 'maquina_estados') {
      const states = rule.estados || [];
      const other = states.find((state) => state !== rule.inicial);
      if (other !== undefined) cases.push({ ...base, accion: 'crear', cuerpo: { [field]: other }, esperado: 422 });
      const forbidden = states.find((state) => state !== rule.inicial && !rule.transiciones.some((item) => item.de === rule.inicial && item.a === state));
      if (forbidden !== undefined) cases.push({ ...base, accion: 'modificar', cuerpo: { [field]: forbidden }, esperado: 422 });
      const allowed = rule.transiciones.find((item) => item.de === rule.inicial);
      if (allowed) last.push({ ...base, accion: 'modificar', cuerpo: { [field]: allowed.a }, esperado: 200 });
    }
  }
  return { payload, typed, defaults, parents, cases: cases.concat(last) };
}

async function createValidRecord(api, operations, target, cleanups, depth) {
  const fail = (message) => { throw new Error(target.id + ': ' + message); };
  if (depth > 3) fail('las referencias obligatorias son circulares');
  const sample = samplePayload(target.schema, target.rules, salted());
  const body = { ...sample.payload };
  for (const parent of sample.parents) {
    const parentOperation = operations.find((item) => item.schema && item.schema.title === parent.entidad);
    if (!parentOperation) fail('no existe una operación para la entidad referenciada ' + parent.entidad);
    body[parent.campo] = (await createValidRecord(api, operations, parentOperation, cleanups, depth + 1)).id;
  }
  const response = await api(target.collectionPath, 'POST', { ...body, verification: 'isolated' });
  if (response.status !== 201) fail('crear respondió ' + response.status + ' (se esperaba 201): ' + JSON.stringify(response.data));
  const id = response.data.id || response.data._id;
  if (!id) fail('la creación no devolvió identificador');
  cleanups.unshift(() => api(target.collectionPath + '/' + id, 'DELETE'));
  return { sample, body, response, id };
}

async function exerciseOperation(api, operations, operation) {
  const fail = (message) => { throw new Error(operation.id + ': ' + message); };
  const expectStatus = (response, status, label) => {
    if (response.status !== status) fail(label + ' respondió ' + response.status + ' (se esperaba ' + status + '): ' + JSON.stringify(response.data));
    return response;
  };
  const same = (expected, actual, format) => (format === 'date-time' ? Date.parse(expected) === Date.parse(actual) : JSON.stringify(expected) === JSON.stringify(actual));
  const cleanups = [];

  try {
    const main = await createValidRecord(api, operations, operation, cleanups, 0);
    const stored = main.response.data.data;
    for (const field of main.sample.typed) {
      if (!same(field.value, stored[field.name], field.format)) fail('el campo ' + field.name + ' no conservó su tipo (' + JSON.stringify(stored[field.name]) + ')');
    }
    for (const item of main.sample.defaults) {
      if (!same(item.valor, stored[item.campo])) fail('el valor por defecto de ' + item.campo + ' no se aplicó');
    }
    const listed = expectStatus(await api(operation.collectionPath), 200, 'listar');
    const records = Array.isArray(listed.data) ? listed.data : (listed.data.data || []);
    if (!records.some((item) => String(item.id || item._id) === String(main.id))) fail('el registro no fue persistido');

    // Ejercitar paginación y búsqueda
    const paged = await api(operation.collectionPath + '?page=1&limit=1');
    if (paged.status === 200) {
      const pagedRecords = Array.isArray(paged.data) ? paged.data : (paged.data.data || []);
      if (pagedRecords.length > 1) fail('la paginación con limit=1 devolvió más de un registro');
    }
    const textField = main.sample.typed.find((field) => ['string', 'date'].includes(field.type) && field.value);
    if (textField) {
      const term = String(textField.value).slice(0, 4);
      if (term) {
        const searched = await api(operation.collectionPath + '?search=' + encodeURIComponent(term));
        if (searched.status === 200) {
          const searchRecords = Array.isArray(searched.data) ? searched.data : (searched.data.data || []);
          if (!searchRecords.some((item) => String(item.id || item._id) === String(main.id))) fail('la búsqueda por texto no encontró el registro');
        }
      }
    }

    const updated = expectStatus(await api(operation.collectionPath + '/' + main.id, 'PATCH', { verification: 'updated' }), 200, 'modificar');
    if (updated.data.data.verification !== 'updated') fail('la modificación no se aplicó');
    if (Object.keys(stored).some((key) => updated.data.data[key] === undefined)) fail('la modificación parcial perdió datos');

    const wrong = main.sample.typed.find((field) => ['integer', 'number', 'boolean'].includes(field.type));
    if (wrong) expectStatus(await api(operation.collectionPath, 'POST', { ...main.body, [wrong.name]: 'valor-que-no-corresponde' }), 400, 'rechazar un tipo incorrecto');

    for (const item of main.sample.cases) {
      const label = item.regla + ' (' + item.tipo + ')';
      let response;
      if (item.accion === 'modificar') {
        response = await api(operation.collectionPath + '/' + main.id, 'PATCH', item.cuerpo);
      } else {
        const body = item.accion === 'duplicar' ? { ...main.body } : { ...main.body, ...(item.cuerpo || {}) };
        for (const field of item.omitir || []) delete body[field];
        response = await api(operation.collectionPath, 'POST', body);
        if (response.status === 201) cleanups.unshift(() => api(operation.collectionPath + '/' + (response.data.id || response.data._id), 'DELETE'));
      }
      if (response.status !== item.esperado) fail('regla ' + label + ' respondió ' + response.status + ' (se esperaba ' + item.esperado + '): ' + JSON.stringify(response.data));
      if (item.esperado === 422 && !(response.data.details || []).some((detail) => detail.regla === item.regla)) fail('regla ' + label + ' fue rechazada por otra causa: ' + JSON.stringify(response.data));
    }

    expectStatus(await api(operation.collectionPath + '/' + main.id, 'DELETE'), 200, 'eliminar');
    expectStatus(await api(operation.collectionPath + '/' + main.id, 'DELETE'), 404, 'eliminar dos veces');
  } finally {
    for (const cleanup of cleanups) { try { await cleanup(); } catch (error) { /* limpieza de mejor esfuerzo */ } }
  }
}

function makeApi(base, token) {
  return async (path, method, body) => {
    const response = await fetch(base + path, {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    return { status: response.status, data: await response.json().catch(() => ({})) };
  };
}

async function setupAccess(base, config) {
  const anonymous = makeApi(base, null);
  const salt = salted();
  const login = await anonymous('/api/auth/login', 'POST', { email: config.adminEmail, password: config.adminPassword });
  if (login.status !== 200 || !login.data.token) throw new Error('No se pudo iniciar sesión con el administrador inicial: ' + login.status + ' ' + JSON.stringify(login.data));
  const [header, payload, signature] = login.data.token.split('.');
  const tampered = [header, payload, signature.slice(0, 4) + (signature[4] === 'A' ? 'B' : 'A') + signature.slice(5)].join('.');
  const admin = makeApi(base, login.data.token);
  const roles = {};
  for (const role of config.roles) {
    const email = 'rol-' + role.id + '-' + salt + '@example.test';
    const password = 'Passw0rd-' + salt;
    const created = await admin('/api/users', 'POST', { email, password, nombre: 'Prueba ' + role.id, rol: role.id });
    if (created.status !== 201) throw new Error('No se pudo crear el usuario del rol ' + role.id + ': ' + created.status + ' ' + JSON.stringify(created.data));
    const session = await anonymous('/api/auth/login', 'POST', { email, password });
    if (session.status !== 200) throw new Error('El usuario del rol ' + role.id + ' no pudo iniciar sesión: ' + session.status);
    roles[role.id] = { api: makeApi(base, session.data.token), userId: created.data.id };
  }
  return {
    anonymous, admin, salt, roles, invalid: makeApi(base, tampered), adminId: login.data.usuario.id,
    cleanup: async () => { for (const role of Object.values(roles)) { try { await admin('/api/users/' + role.userId, 'DELETE'); } catch (error) { /* mejor esfuerzo */ } } }
  };
}

async function exerciseAccess(access, operations, operation, matrix) {
  const fail = (message) => { throw new Error(operation.id + ' (acceso): ' + message); };
  const status = (response, expected, label) => {
    if (response.status !== expected) fail(label + ' respondió ' + response.status + ' (se esperaba ' + expected + '): ' + JSON.stringify(response.data));
  };
  const permitted = (response, label) => {
    if (response.status === 401 || response.status === 403) fail(label + ' fue rechazado con ' + response.status + ' pese a estar permitido');
  };
  const cleanups = [];
  try {
    const path = operation.collectionPath;
    status(await access.anonymous(path), 401, 'listar sin sesión');
    status(await access.anonymous(path, 'POST', {}), 401, 'crear sin sesión');
    status(await access.invalid(path), 401, 'listar con un token alterado');
    const record = await createValidRecord(access.admin, operations, operation, cleanups, 0);
    for (const [role, session] of Object.entries(access.roles)) {
      const allowed = matrix[role] || [];
      const label = 'rol ' + role;
      const check = (response, method, text) => (allowed.includes(method) ? permitted(response, label + ' ' + text) : status(response, 403, label + ' ' + text + ' sin permiso'));
      check(await session.api(path), 'GET', 'listar');
      const created = await session.api(path, 'POST', record.body);
      if (created.status === 201) cleanups.unshift(() => access.admin(path + '/' + (created.data.id || created.data._id), 'DELETE'));
      check(created, 'POST', 'crear');
      check(await session.api(path + '/' + record.id, 'PATCH', { verification: 'acceso' }), 'PATCH', 'modificar');
      // Cada eliminación permitida consume un registro propio para no afectar a los demás roles.
      const disposable = allowed.includes('DELETE') ? await createValidRecord(access.admin, operations, operation, cleanups, 0) : record;
      check(await session.api(path + '/' + disposable.id, 'DELETE'), 'DELETE', 'eliminar');
    }
  } finally {
    for (const cleanup of cleanups) { try { await cleanup(); } catch (error) { /* mejor esfuerzo */ } }
  }
}

async function exerciseAuth(access, config) {
  const fail = (message) => { throw new Error('autenticación: ' + message); };
  const status = (response, expected, label) => {
    if (response.status !== expected) fail(label + ' respondió ' + response.status + ' (se esperaba ' + expected + '): ' + JSON.stringify(response.data));
    return response;
  };
  const { anonymous, admin, salt } = access;
  const password = 'Passw0rd-1234';
  const role = config.roles.length ? config.roles[0].id : 'administrador';
  const mail = (name) => name + '-' + salt + '@example.test';
  const login = (email, secret) => anonymous('/api/auth/login', 'POST', { email, password: secret });

  status(await anonymous('/health'), 200, 'comprobación de salud pública');
  status(await anonymous('/api/contract'), 401, 'contrato sin sesión');
  status(await anonymous('/api/openapi.json'), 401, 'documentación OpenAPI sin sesión');
  status(await anonymous('/api/auth/me'), 401, 'perfil sin sesión');
  status(await login(config.adminEmail, 'contraseña-incorrecta'), 401, 'inicio de sesión con contraseña incorrecta');
  status(await anonymous('/api/auth/login', 'POST', {}), 400, 'inicio de sesión sin datos');
  const me = status(await admin('/api/auth/me'), 200, 'perfil del administrador');
  if (!me.data.permisos || me.data.permisos.administrador !== true) fail('el administrador no figura como tal en su perfil');

  const created = status(await admin('/api/users', 'POST', { email: mail('usuario'), password, nombre: 'Usuario', rol: role }), 201, 'crear usuario');
  if ('password' in created.data || 'password_hash' in created.data) fail('la respuesta expone la contraseña');
  status(await admin('/api/users', 'POST', { email: mail('usuario'), password, rol: role }), 409, 'crear un correo repetido');
  status(await admin('/api/users', 'POST', { email: mail('debil'), password: '123', rol: role }), 400, 'contraseña débil');
  status(await admin('/api/users', 'POST', { email: 'no-es-correo', password, rol: role }), 400, 'correo inválido');
  status(await admin('/api/users', 'POST', { email: mail('sinrol'), password, rol: 'rol-inexistente' }), 400, 'rol inexistente');
  const listed = status(await admin('/api/users'), 200, 'listar usuarios');
  if (listed.data.some((user) => 'password_hash' in user)) fail('el listado expone hashes de contraseña');

  // Desactivar un usuario revoca sus sesiones al instante; reactivarlo las restablece.
  const session = status(await login(mail('usuario'), password), 200, 'inicio de sesión del usuario nuevo');
  const own = makeApi(config.base, session.data.token);
  status(await own('/api/auth/me'), 200, 'sesión del usuario nuevo');
  status(await admin('/api/users/' + created.data.id, 'PATCH', { activo: false }), 200, 'desactivar usuario');
  status(await own('/api/auth/me'), 401, 'sesión de un usuario desactivado');
  status(await login(mail('usuario'), password), 401, 'inicio de sesión de un usuario desactivado');
  status(await admin('/api/users/' + created.data.id, 'PATCH', { activo: true }), 200, 'reactivar usuario');
  status(await login(mail('usuario'), password), 200, 'inicio de sesión tras reactivar');
  status(await admin('/api/users/' + created.data.id, 'DELETE'), 200, 'eliminar usuario');
  status(await admin('/api/users/' + created.data.id, 'DELETE'), 404, 'eliminar usuario dos veces');

  // Protecciones del administrador.
  status(await admin('/api/users/' + access.adminId, 'PATCH', { activo: false }), 409, 'desactivar al único administrador');
  status(await admin('/api/users/' + access.adminId, 'DELETE'), 400, 'eliminar al propio administrador');
  const firstRole = Object.values(access.roles)[0];
  if (firstRole) status(await firstRole.api('/api/users'), 403, 'gestionar usuarios sin ser administrador');

  // Bloqueo por intentos fallidos.
  const target = status(await admin('/api/users', 'POST', { email: mail('bloqueo'), password, rol: role }), 201, 'crear usuario de bloqueo');
  for (let attempt = 0; attempt < 5; attempt += 1) status(await login(mail('bloqueo'), 'incorrecta-' + attempt), 401, 'intento fallido ' + (attempt + 1));
  status(await login(mail('bloqueo'), password), 429, 'inicio de sesión tras exceder los intentos');
  await admin('/api/users/' + target.data.id, 'DELETE');

  // Registro abierto: solo para los roles que lo permiten.
  const open = config.roles.filter((item) => item.autoregistro);
  if (!open.length) {
    status(await anonymous('/api/auth/register', 'POST', { email: mail('registro'), password, rol: role }), 403, 'registro con el registro cerrado');
  } else {
    status(await anonymous('/api/auth/register', 'POST', { email: mail('registro'), password, rol: 'administrador' }), 400, 'registro como administrador');
    const registered = status(await anonymous('/api/auth/register', 'POST', { email: mail('registro'), password, rol: open[0].id }), 201, 'registro abierto');
    if (registered.data.usuario.rol !== open[0].id) fail('el registro asignó un rol distinto al solicitado');
    status(await login(mail('registro'), password), 200, 'inicio de sesión del usuario registrado');
    await admin('/api/users/' + registered.data.usuario.id, 'DELETE');
  }
}

async function exerciseOpenApi(api, operations, auth) {
  const fail = (message) => { throw new Error('OpenAPI: ' + message); };
  const response = await api('/api/openapi.json');
  if (response.status !== 200) fail('GET /api/openapi.json respondió ' + response.status);
  const doc = response.data;
  if (!/^3\.1\./.test(String(doc.openapi))) fail('la versión debe ser 3.1.x y es ' + doc.openapi);
  for (const operation of operations) {
    const collection = doc.paths[operation.collectionPath];
    const item = doc.paths[operation.collectionPath + '/{id}'];
    if (!collection || !collection.get || !collection.post) fail('falta documentar listar y crear en ' + operation.collectionPath);
    if (!item || !item.patch || !item.delete) fail('falta documentar modificar y eliminar en ' + operation.collectionPath + '/{id}');
    const required = ((((collection.post.requestBody || {}).content || {})['application/json'] || {}).schema || {}).$ref;
    const schema = required ? doc.components.schemas[required.split('/').pop()] : null;
    for (const rule of operation.rules || []) {
      if (rule.tipo === 'requerido' && schema && !(schema.required || []).includes(rule.campo)) fail(operation.id + ': la regla ' + rule.id + ' no figura como campo obligatorio');
      if (rule.tipo === 'rango' && schema && schema.properties[rule.campo].maximum !== rule.max) fail(operation.id + ': la regla ' + rule.id + ' no figura como máximo');
    }
  }
  const secured = Boolean(auth && auth.habilitada);
  if (secured !== Boolean(doc.components.securitySchemes && doc.components.securitySchemes.bearerAuth)) fail('el esquema de seguridad no coincide con la política aprobada');
  if (secured !== Boolean(doc.paths['/api/auth/login'])) fail('la ruta de inicio de sesión debe documentarse solo con autenticación');
}

async function exerciseAssociation(api, operations, association, access, auth) {
  const fail = (message) => { throw new Error('N:M ' + association.table + ': ' + message); };
  const expectStatus = (response, expected, label) => {
    if (response.status !== expected) fail(label + ' respondió ' + response.status + ' (se esperaba ' + expected + ')');
    return response.data;
  };
  if (!association.endpoints_generated) fail('no hay API generada');
  const endpoints = (association.operations || []).map((keys) => operations.find((operation) => keys.includes(operation.key)));
  if (endpoints.length !== 2 || endpoints.some((endpoint) => !endpoint)) fail('faltan operaciones para crear ambos extremos');
  const cleanups = [];
  const path = '/api/associations/' + encodeURIComponent(association.table);
  try {
    const source = await createValidRecord(api, operations, endpoints[0], cleanups, 0);
    const targets = [await createValidRecord(api, operations, endpoints[1], cleanups, 0), await createValidRecord(api, operations, endpoints[1], cleanups, 0)];
    const pair = (target) => ({ source_id: String(source.id), target_id: String(target.id) });
    const listPath = path + '?source_id=' + encodeURIComponent(source.id);
    const absent = await createValidRecord(api, operations, endpoints[1], cleanups, 0);
    expectStatus(await api(endpoints[1].collectionPath + '/' + absent.id, 'DELETE'), 200, 'preparar extremo inexistente');
    expectStatus(await api(path, 'POST', pair(absent)), 404, 'rechazar extremo inexistente');
    expectStatus(await api(path, 'POST', { source_id: String(source.id), target_id: 'no-es-un-id' }), 400, 'rechazar ID inválido');
    for (const target of targets) {
      cleanups.unshift(() => api(path, 'DELETE', pair(target)));
      expectStatus(await api(path, 'POST', pair(target)), 200, 'asociar');
      expectStatus(await api(path, 'POST', pair(target)), 200, 'repetir asociación idempotente');
    }
    const first = expectStatus(await api(listPath + '&limit=1'), 200, 'primera página');
    if (!Array.isArray(first.data) || first.data.length !== 1 || first.has_more !== true) fail('primera página o has_more incorrectos');
    const second = expectStatus(await api(listPath + '&limit=1&after_target_id=' + encodeURIComponent(first.data[0].target_id)), 200, 'segunda página');
    if (!Array.isArray(second.data) || second.data.length !== 1 || second.has_more !== false) fail('segunda página o cursor incorrectos');
    const rows = [...first.data, ...second.data];
    if (new Set(rows.map((row) => String(row.target_id))).size !== 2 || targets.some((target) => !rows.some((row) => String(row.target_id) === String(target.id))) || rows.some((row) => String(row.source_id) !== String(source.id))) fail('vínculos duplicados, omitidos o asociados a otro origen');
    expectStatus(await api(endpoints[0].collectionPath + '/' + source.id, 'DELETE'), 409, 'proteger origen vinculado');
    expectStatus(await api(endpoints[1].collectionPath + '/' + targets[0].id, 'DELETE'), 409, 'proteger destino vinculado');
    if (access) {
      expectStatus(await access.anonymous(listPath), 401, 'consulta anónima');
      expectStatus(await access.invalid(path, 'POST', pair(targets[0])), 401, 'token inválido');
      for (const [role, session] of Object.entries(access.roles)) {
        const permitted = (verbs) => association.operations.every((keys) => keys.some((key) => verbs.every((verb) => (auth.operaciones?.[key]?.[role] || []).includes(verb))));
        expectStatus(await session.api(listPath), permitted(['GET']) ? 200 : 403, 'lectura del rol ' + role);
        const write = permitted(['GET', 'PATCH']);
        // Usar un vínculo ya existente para no alterar el caso de otros roles.
        expectStatus(await session.api(path, 'POST', pair(targets[0])), write ? 200 : 403, 'asociación del rol ' + role);
        expectStatus(await session.api(path, 'DELETE', pair(targets[0])), write ? 200 : 403, 'desasociación del rol ' + role);
        if (write) expectStatus(await session.api(path, 'POST', pair(targets[0])), 200, 'restaurar vínculo del rol ' + role);
      }
    }
    for (const target of targets) {
      expectStatus(await api(path, 'DELETE', pair(target)), 200, 'desasociar');
      expectStatus(await api(path, 'DELETE', pair(target)), 200, 'repetir desasociación idempotente');
      const records = expectStatus(await api(endpoints[1].collectionPath), 200, 'conservar destino');
      const data = Array.isArray(records) ? records : records.data;
      if (!data?.some((record) => String(record.id || record._id) === String(target.id))) fail('desasociar borró el destino');
    }
    const empty = expectStatus(await api(listPath), 200, 'lista vacía');
    if (!Array.isArray(empty.data) || empty.data.length || empty.has_more !== false) fail('desasociación no persistida');
    expectStatus(await api(endpoints[0].collectionPath + '/' + source.id, 'DELETE'), 200, 'eliminar origen después de desasociar');
    return { table: association.table, estado: 'correcta' };
  } finally {
    for (const cleanup of cleanups) { try { await cleanup(); } catch { /* Solo datos creados por esta prueba, mejor esfuerzo. */ } }
  }
}

const operations = [{"id":"RF-01","key":"rf-01","name":"Visualización de menú digital","description":"El sistema DEBE mostrar un menú digital en la aplicación móvil para que los clientes consulten los platillos disponibles.","actors":["Cliente"],"collectionPath":"/api/operations/rf-01","itemPath":"/api/operations/rf-01/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"menu","relatedEntities":["cliente","platillo"],"rules":[],"schema":{"type":"object","title":"Menu","properties":{"id":{"type":"string","readOnly":true},"version":{"type":"string"}},"required":[],"additionalProperties":true}},{"id":"RF-02","key":"rf-02","name":"Reserva de mesa o silla","description":"El sistema DEBE permitir a los clientes realizar la reserva de una mesa o silla a través de la aplicación móvil.","actors":["Cliente"],"collectionPath":"/api/operations/rf-02","itemPath":"/api/operations/rf-02/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"reserva","relatedEntities":["mesa","cliente"],"rules":[],"schema":{"type":"object","title":"Reserva","properties":{"id":{"type":"string","readOnly":true},"fechaHora":{"type":"string","format":"date-time"},"codigoQR":{"type":"string"},"estado":{"type":"string"},"cliente_id":{"type":"string","x-references":"Cliente"},"mesa_id":{"type":"string","x-references":"Mesa"}},"required":[],"additionalProperties":true}},{"id":"RF-03","key":"rf-03","name":"Compra de paquetes semanales prepagados","description":"El sistema DEBE permitir a los clientes realizar la compra de paquetes semanales prepagados desde la aplicación móvil.","actors":["Cliente"],"collectionPath":"/api/operations/rf-03","itemPath":"/api/operations/rf-03/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"paqueteprepagado","relatedEntities":["cliente"],"rules":[],"schema":{"type":"object","title":"PaquetePrepagado","properties":{"id":{"type":"string","readOnly":true},"descripcion":{"type":"string"},"saldo":{"type":"number"},"cliente_id":{"type":"string","x-references":"Cliente"}},"required":[],"additionalProperties":true}},{"id":"RF-04","key":"rf-04","name":"Acumulación de puntos por compras","description":"El sistema DEBE calcular y acumular puntos en la cuenta del cliente en función de las compras realizadas.","actors":["Cliente"],"collectionPath":"/api/operations/rf-04","itemPath":"/api/operations/rf-04/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"puntos","relatedEntities":["cliente"],"rules":[],"schema":{"type":"object","title":"Puntos","properties":{"id":{"type":"string","readOnly":true},"cantidad":{"type":"integer"},"cliente_id":{"type":"string","x-references":"Cliente"}},"required":[],"additionalProperties":true}},{"id":"RF-05","key":"rf-05","name":"Visualización de pedidos en tiempo real en cocina","description":"El sistema DEBE mostrar en las pantallas web de cocina los nuevos pedidos en tiempo real utilizando Socket.IO.","actors":["Personal de Cocina"],"collectionPath":"/api/operations/rf-05","itemPath":"/api/operations/rf-05/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"pedido","relatedEntities":[],"rules":[],"schema":{"type":"object","title":"Pedido","properties":{"id":{"type":"string","readOnly":true},"fechaHora":{"type":"string","format":"date-time"},"estado":{"type":"string"},"cliente_id":{"type":"string","x-references":"Cliente"},"mesa_id":{"type":"string","x-references":"Mesa"},"pago_id":{"type":"string","x-references":"Pago"}},"required":[],"additionalProperties":true}},{"id":"RF-06","key":"rf-06","name":"Marcado de platos agotados por cocina","description":"El sistema DEBE permitir al personal de cocina marcar los platos agotados para actualizar la disponibilidad en tiempo real.","actors":["Personal de Cocina"],"collectionPath":"/api/operations/rf-06","itemPath":"/api/operations/rf-06/:id","methods":["GET","POST","PATCH","DELETE"],"entity":null,"relatedEntities":[],"rules":[],"schema":{"type":"object","additionalProperties":true}},{"id":"RF-07","key":"rf-07","name":"Visualización de mesas asignadas y toma de pedidos por meseros","description":"El sistema DEBE permitir a los meseros visualizar sus mesas asignadas y registrar nuevos pedidos desde sus pantallas web.","actors":["Mesero"],"collectionPath":"/api/operations/rf-07","itemPath":"/api/operations/rf-07/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"mesa","relatedEntities":["pedido"],"rules":[],"schema":{"type":"object","title":"Mesa","properties":{"id":{"type":"string","readOnly":true},"numero":{"type":"integer"},"capacidad":{"type":"integer"},"estado":{"type":"string"}},"required":[],"additionalProperties":true}},{"id":"RF-08","key":"rf-08","name":"Validación de reserva mediante código QR","description":"El sistema DEBE permitir a los meseros escanear el código QR del cliente para validar su reserva.","actors":["Mesero"],"collectionPath":"/api/operations/rf-08","itemPath":"/api/operations/rf-08/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"reserva","relatedEntities":["cliente"],"rules":[],"schema":{"type":"object","title":"Reserva","properties":{"id":{"type":"string","readOnly":true},"fechaHora":{"type":"string","format":"date-time"},"codigoQR":{"type":"string"},"estado":{"type":"string"},"cliente_id":{"type":"string","x-references":"Cliente"},"mesa_id":{"type":"string","x-references":"Mesa"}},"required":[],"additionalProperties":true}},{"id":"RF-09","key":"rf-09","name":"Procesamiento de cobros y validación de planes prepagados","description":"El sistema DEBE permitir a caja realizar el cobro en efectivo o transferencia, así como validar los planes prepagados de los clientes.","actors":["Caja"],"collectionPath":"/api/operations/rf-09","itemPath":"/api/operations/rf-09/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"cliente","relatedEntities":[],"rules":[],"schema":{"type":"object","title":"Cliente","properties":{"id":{"type":"string","readOnly":true},"nombre":{"type":"string"},"telefono":{"type":"string"},"correo":{"type":"string"}},"required":[],"additionalProperties":true}},{"id":"RF-10","key":"rf-10","name":"Consulta de reportes de ventas y gestión de precios","description":"El sistema DEBE permitir al administrador consultar reportes de ventas y modificar los precios del menú.","actors":["Administrador"],"collectionPath":"/api/operations/rf-10","itemPath":"/api/operations/rf-10/:id","methods":["GET","POST","PATCH","DELETE"],"entity":"menu","relatedEntities":[],"rules":[],"schema":{"type":"object","title":"Menu","properties":{"id":{"type":"string","readOnly":true},"version":{"type":"string"}},"required":[],"additionalProperties":true}}];
const associations = [];
const auth = {"habilitada":true,"expiracion":"8h","roles":{"cliente":{"nombre":"Cliente","autoregistro":false},"personal-de-cocina":{"nombre":"Personal de Cocina","autoregistro":false},"mesero":{"nombre":"Mesero","autoregistro":false},"caja":{"nombre":"Caja","autoregistro":false}},"operaciones":{"rf-01":{"cliente":["GET","POST","PATCH","DELETE"]},"rf-02":{"cliente":["GET","POST","PATCH","DELETE"]},"rf-03":{"cliente":["GET","POST","PATCH","DELETE"]},"rf-04":{"cliente":["GET","POST","PATCH","DELETE"]},"rf-05":{"personal-de-cocina":["GET","POST","PATCH","DELETE"]},"rf-06":{"personal-de-cocina":["GET","POST","PATCH","DELETE"]},"rf-07":{"mesero":["GET","POST","PATCH","DELETE"]},"rf-08":{"mesero":["GET","POST","PATCH","DELETE"]},"rf-09":{"caja":["GET","POST","PATCH","DELETE"]},"rf-10":{}}};
const roles = Object.entries(auth.roles || {}).map(([id, role]) => ({ id, autoregistro: role.autoregistro === true }));
let access = null;
let api = makeApi(base, null);

before(async () => {
  if (!auth.habilitada) return;
  access = await setupAccess(base, { adminEmail: process.env.ADMIN_EMAIL, adminPassword: process.env.ADMIN_PASSWORD, roles });
  api = access.admin;
});
after(async () => { if (access) await access.cleanup(); });

for (const association of associations) {
  test('N:M ' + association.table + ': vínculos, paginación, permisos e integridad', async () => {
    await exerciseAssociation(api, operations, association, access, auth);
  });
}

test('el contrato declara operaciones', () => {
  assert.ok(operations.length > 0, 'El contrato no contiene operaciones');
});

test('la documentación OpenAPI describe todas las operaciones y la seguridad aprobada', async () => {
  await exerciseOpenApi(api, operations, auth);
});

for (const operation of operations) {
  test(operation.id + ': CRUD tipado y reglas de negocio (' + (operation.rules || []).length + ')', async () => {
    await exerciseOperation(api, operations, operation);
  });
  if (auth.habilitada) {
    test(operation.id + ': permisos por rol, sin sesión y con token alterado', async () => {
      await exerciseAccess(access, operations, operation, (auth.operaciones || {})[operation.key] || {});
    });
  }
}

if (auth.habilitada) {
  test('autenticación: sesión, usuarios, revocación, bloqueo y registro', async () => {
    await exerciseAuth(access, { base, adminEmail: process.env.ADMIN_EMAIL, roles });
  });
}
