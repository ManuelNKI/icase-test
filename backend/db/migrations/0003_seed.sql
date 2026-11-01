-- Migración 0003_seed: generada por I-CASE.
-- Se aplica automáticamente al iniciar el backend y se registra en schema_migrations.

INSERT INTO "cliente" ("id", "nombre", "telefono", "correo", "extra", "created_at", "updated_at") VALUES (1, 'Cliente 1', '+51999888771', 'Cliente 1', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "cliente" ("id", "nombre", "telefono", "correo", "extra", "created_at", "updated_at") VALUES (2, 'Cliente 2', '+51999888772', 'Cliente 2', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"cliente"', 'id'), coalesce((SELECT max("id") FROM "cliente"), 1));

INSERT INTO "menu" ("id", "version", "extra", "created_at", "updated_at") VALUES (1, 'Menu 1', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "menu" ("id", "version", "extra", "created_at", "updated_at") VALUES (2, 'Menu 2', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"menu"', 'id'), coalesce((SELECT max("id") FROM "menu"), 1));

INSERT INTO "mesa" ("id", "numero", "capacidad", "estado", "extra", "created_at", "updated_at") VALUES (1, 10, 10, 'Mesa 1', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "mesa" ("id", "numero", "capacidad", "estado", "extra", "created_at", "updated_at") VALUES (2, 20, 20, 'Mesa 2', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"mesa"', 'id'), coalesce((SELECT max("id") FROM "mesa"), 1));

INSERT INTO "pedido" ("id", "fecha_hora", "estado", "cliente_id", "mesa_id", "pago_id", "extra", "created_at", "updated_at") VALUES (1, '2025-01-11T10:00:00Z', 'Pedido 1', 1, 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "pedido" ("id", "fecha_hora", "estado", "cliente_id", "mesa_id", "pago_id", "extra", "created_at", "updated_at") VALUES (2, '2025-01-12T10:00:00Z', 'Pedido 2', 2, 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"pedido"', 'id'), coalesce((SELECT max("id") FROM "pedido"), 1));

INSERT INTO "platillo" ("id", "nombre", "precio", "disponible", "menu_id", "pedido_id", "extra", "created_at", "updated_at") VALUES (1, 'Platillo 1', 15.5, true, 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "platillo" ("id", "nombre", "precio", "disponible", "menu_id", "pedido_id", "extra", "created_at", "updated_at") VALUES (2, 'Platillo 2', 99.9, false, 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"platillo"', 'id'), coalesce((SELECT max("id") FROM "platillo"), 1));

INSERT INTO "reserva" ("id", "fecha_hora", "codigo_qr", "estado", "cliente_id", "mesa_id", "extra", "created_at", "updated_at") VALUES (1, '2025-01-11T10:00:00Z', 'Reserva 1', 'Reserva 1', 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "reserva" ("id", "fecha_hora", "codigo_qr", "estado", "cliente_id", "mesa_id", "extra", "created_at", "updated_at") VALUES (2, '2025-01-12T10:00:00Z', 'Reserva 2', 'Reserva 2', 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"reserva"', 'id'), coalesce((SELECT max("id") FROM "reserva"), 1));

INSERT INTO "paquete_prepagado" ("id", "descripcion", "saldo", "cliente_id", "extra", "created_at", "updated_at") VALUES (1, 'PaquetePrepagado 1', 15.5, 1, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "paquete_prepagado" ("id", "descripcion", "saldo", "cliente_id", "extra", "created_at", "updated_at") VALUES (2, 'PaquetePrepagado 2', 99.9, 2, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"paquete_prepagado"', 'id'), coalesce((SELECT max("id") FROM "paquete_prepagado"), 1));

INSERT INTO "pago" ("id", "monto", "metodo", "extra", "created_at", "updated_at") VALUES (1, 15.5, 'Pago 1', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "pago" ("id", "monto", "metodo", "extra", "created_at", "updated_at") VALUES (2, 99.9, 'Pago 2', '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"pago"', 'id'), coalesce((SELECT max("id") FROM "pago"), 1));

INSERT INTO "puntos" ("id", "cantidad", "cliente_id", "extra", "created_at", "updated_at") VALUES (1, 10, 1, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "puntos" ("id", "cantidad", "cliente_id", "extra", "created_at", "updated_at") VALUES (2, 20, 2, '{}'::jsonb, now(), now()) ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"puntos"', 'id'), coalesce((SELECT max("id") FROM "puntos"), 1));
