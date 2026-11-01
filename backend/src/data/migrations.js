module.exports = [
  {
    "id": "0001_init",
    "statements": [
      "CREATE TABLE IF NOT EXISTS \"cliente\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"nombre\" TEXT,\n  \"telefono\" TEXT,\n  \"correo\" TEXT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE TABLE IF NOT EXISTS \"menu\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"version\" TEXT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE TABLE IF NOT EXISTS \"platillo\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"nombre\" TEXT,\n  \"precio\" DOUBLE PRECISION,\n  \"disponible\" BOOLEAN,\n  \"menu_id\" BIGINT,\n  \"pedido_id\" BIGINT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_platillo_menu_id\" ON \"platillo\" (\"menu_id\")",
      "CREATE INDEX IF NOT EXISTS \"idx_platillo_pedido_id\" ON \"platillo\" (\"pedido_id\")",
      "CREATE TABLE IF NOT EXISTS \"reserva\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"fecha_hora\" TIMESTAMPTZ,\n  \"codigo_qr\" TEXT,\n  \"estado\" TEXT,\n  \"cliente_id\" BIGINT,\n  \"mesa_id\" BIGINT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_reserva_cliente_id\" ON \"reserva\" (\"cliente_id\")",
      "CREATE INDEX IF NOT EXISTS \"idx_reserva_mesa_id\" ON \"reserva\" (\"mesa_id\")",
      "CREATE TABLE IF NOT EXISTS \"mesa\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"numero\" BIGINT,\n  \"capacidad\" BIGINT,\n  \"estado\" TEXT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE TABLE IF NOT EXISTS \"pedido\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"fecha_hora\" TIMESTAMPTZ,\n  \"estado\" TEXT,\n  \"cliente_id\" BIGINT,\n  \"mesa_id\" BIGINT,\n  \"pago_id\" BIGINT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_pedido_cliente_id\" ON \"pedido\" (\"cliente_id\")",
      "CREATE INDEX IF NOT EXISTS \"idx_pedido_mesa_id\" ON \"pedido\" (\"mesa_id\")",
      "CREATE INDEX IF NOT EXISTS \"idx_pedido_pago_id\" ON \"pedido\" (\"pago_id\")",
      "CREATE TABLE IF NOT EXISTS \"paquete_prepagado\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"descripcion\" TEXT,\n  \"saldo\" DOUBLE PRECISION,\n  \"cliente_id\" BIGINT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_paquete_prepagado_cliente_id\" ON \"paquete_prepagado\" (\"cliente_id\")",
      "CREATE TABLE IF NOT EXISTS \"pago\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"monto\" DOUBLE PRECISION,\n  \"metodo\" TEXT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE TABLE IF NOT EXISTS \"puntos\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"cantidad\" BIGINT,\n  \"cliente_id\" BIGINT,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_puntos_cliente_id\" ON \"puntos\" (\"cliente_id\")",
      "CREATE TABLE IF NOT EXISTS \"icase_records\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"capability\" TEXT NOT NULL,\n  \"extra\" JSONB NOT NULL DEFAULT '{}'::jsonb,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE INDEX IF NOT EXISTS \"idx_icase_records_capability\" ON \"icase_records\" (\"capability\")",
      "ALTER TABLE \"platillo\" ADD CONSTRAINT \"fk_platillo_menu_id\" FOREIGN KEY (\"menu_id\") REFERENCES \"menu\" (\"id\")",
      "ALTER TABLE \"platillo\" ADD CONSTRAINT \"fk_platillo_pedido_id\" FOREIGN KEY (\"pedido_id\") REFERENCES \"pedido\" (\"id\")",
      "ALTER TABLE \"reserva\" ADD CONSTRAINT \"fk_reserva_cliente_id\" FOREIGN KEY (\"cliente_id\") REFERENCES \"cliente\" (\"id\")",
      "ALTER TABLE \"reserva\" ADD CONSTRAINT \"fk_reserva_mesa_id\" FOREIGN KEY (\"mesa_id\") REFERENCES \"mesa\" (\"id\")",
      "ALTER TABLE \"pedido\" ADD CONSTRAINT \"fk_pedido_cliente_id\" FOREIGN KEY (\"cliente_id\") REFERENCES \"cliente\" (\"id\")",
      "ALTER TABLE \"pedido\" ADD CONSTRAINT \"fk_pedido_mesa_id\" FOREIGN KEY (\"mesa_id\") REFERENCES \"mesa\" (\"id\")",
      "ALTER TABLE \"paquete_prepagado\" ADD CONSTRAINT \"fk_paquete_prepagado_cliente_id\" FOREIGN KEY (\"cliente_id\") REFERENCES \"cliente\" (\"id\")",
      "ALTER TABLE \"puntos\" ADD CONSTRAINT \"fk_puntos_cliente_id\" FOREIGN KEY (\"cliente_id\") REFERENCES \"cliente\" (\"id\")"
    ]
  },
  {
    "id": "0002_auth",
    "statements": [
      "CREATE TABLE IF NOT EXISTS \"icase_users\" (\n  \"id\" BIGSERIAL PRIMARY KEY,\n  \"email\" TEXT NOT NULL,\n  \"nombre\" TEXT NOT NULL DEFAULT '',\n  \"rol\" TEXT NOT NULL,\n  \"activo\" BOOLEAN NOT NULL DEFAULT true,\n  \"password_hash\" TEXT NOT NULL,\n  \"created_at\" TIMESTAMPTZ NOT NULL DEFAULT now(),\n  \"updated_at\" TIMESTAMPTZ NOT NULL DEFAULT now()\n)",
      "CREATE UNIQUE INDEX IF NOT EXISTS \"uq_icase_users_email\" ON \"icase_users\" (\"email\")"
    ]
  },
  {
    "id": "0003_seed",
    "statements": [
      "INSERT INTO \"cliente\" (\"id\", \"nombre\", \"telefono\", \"correo\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 'Cliente 1', '+51999888771', 'Cliente 1', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"cliente\" (\"id\", \"nombre\", \"telefono\", \"correo\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 'Cliente 2', '+51999888772', 'Cliente 2', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"cliente\"', 'id'), coalesce((SELECT max(\"id\") FROM \"cliente\"), 1))",
      "INSERT INTO \"menu\" (\"id\", \"version\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 'Menu 1', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"menu\" (\"id\", \"version\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 'Menu 2', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"menu\"', 'id'), coalesce((SELECT max(\"id\") FROM \"menu\"), 1))",
      "INSERT INTO \"mesa\" (\"id\", \"numero\", \"capacidad\", \"estado\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 10, 10, 'Mesa 1', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"mesa\" (\"id\", \"numero\", \"capacidad\", \"estado\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 20, 20, 'Mesa 2', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"mesa\"', 'id'), coalesce((SELECT max(\"id\") FROM \"mesa\"), 1))",
      "INSERT INTO \"pedido\" (\"id\", \"fecha_hora\", \"estado\", \"cliente_id\", \"mesa_id\", \"pago_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, '2025-01-11T10:00:00Z', 'Pedido 1', 1, 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"pedido\" (\"id\", \"fecha_hora\", \"estado\", \"cliente_id\", \"mesa_id\", \"pago_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, '2025-01-12T10:00:00Z', 'Pedido 2', 2, 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"pedido\"', 'id'), coalesce((SELECT max(\"id\") FROM \"pedido\"), 1))",
      "INSERT INTO \"platillo\" (\"id\", \"nombre\", \"precio\", \"disponible\", \"menu_id\", \"pedido_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 'Platillo 1', 15.5, true, 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"platillo\" (\"id\", \"nombre\", \"precio\", \"disponible\", \"menu_id\", \"pedido_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 'Platillo 2', 99.9, false, 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"platillo\"', 'id'), coalesce((SELECT max(\"id\") FROM \"platillo\"), 1))",
      "INSERT INTO \"reserva\" (\"id\", \"fecha_hora\", \"codigo_qr\", \"estado\", \"cliente_id\", \"mesa_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, '2025-01-11T10:00:00Z', 'Reserva 1', 'Reserva 1', 1, 1, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"reserva\" (\"id\", \"fecha_hora\", \"codigo_qr\", \"estado\", \"cliente_id\", \"mesa_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, '2025-01-12T10:00:00Z', 'Reserva 2', 'Reserva 2', 2, 2, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"reserva\"', 'id'), coalesce((SELECT max(\"id\") FROM \"reserva\"), 1))",
      "INSERT INTO \"paquete_prepagado\" (\"id\", \"descripcion\", \"saldo\", \"cliente_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 'PaquetePrepagado 1', 15.5, 1, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"paquete_prepagado\" (\"id\", \"descripcion\", \"saldo\", \"cliente_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 'PaquetePrepagado 2', 99.9, 2, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"paquete_prepagado\"', 'id'), coalesce((SELECT max(\"id\") FROM \"paquete_prepagado\"), 1))",
      "INSERT INTO \"pago\" (\"id\", \"monto\", \"metodo\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 15.5, 'Pago 1', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"pago\" (\"id\", \"monto\", \"metodo\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 99.9, 'Pago 2', '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"pago\"', 'id'), coalesce((SELECT max(\"id\") FROM \"pago\"), 1))",
      "INSERT INTO \"puntos\" (\"id\", \"cantidad\", \"cliente_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (1, 10, 1, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "INSERT INTO \"puntos\" (\"id\", \"cantidad\", \"cliente_id\", \"extra\", \"created_at\", \"updated_at\") VALUES (2, 20, 2, '{}'::jsonb, now(), now()) ON CONFLICT (\"id\") DO NOTHING",
      "SELECT setval(pg_get_serial_sequence('\"puntos\"', 'id'), coalesce((SELECT max(\"id\") FROM \"puntos\"), 1))"
    ]
  }
];
