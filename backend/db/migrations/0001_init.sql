-- Migración 0001_init: generada por I-CASE.
-- Se aplica automáticamente al iniciar el backend y se registra en schema_migrations.

CREATE TABLE IF NOT EXISTS "cliente" (
  "id" BIGSERIAL PRIMARY KEY,
  "nombre" TEXT,
  "telefono" TEXT,
  "correo" TEXT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "menu" (
  "id" BIGSERIAL PRIMARY KEY,
  "version" TEXT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "platillo" (
  "id" BIGSERIAL PRIMARY KEY,
  "nombre" TEXT,
  "precio" DOUBLE PRECISION,
  "disponible" BOOLEAN,
  "menu_id" BIGINT,
  "pedido_id" BIGINT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_platillo_menu_id" ON "platillo" ("menu_id");

CREATE INDEX IF NOT EXISTS "idx_platillo_pedido_id" ON "platillo" ("pedido_id");

CREATE TABLE IF NOT EXISTS "reserva" (
  "id" BIGSERIAL PRIMARY KEY,
  "fecha_hora" TIMESTAMPTZ,
  "codigo_qr" TEXT,
  "estado" TEXT,
  "cliente_id" BIGINT,
  "mesa_id" BIGINT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_reserva_cliente_id" ON "reserva" ("cliente_id");

CREATE INDEX IF NOT EXISTS "idx_reserva_mesa_id" ON "reserva" ("mesa_id");

CREATE TABLE IF NOT EXISTS "mesa" (
  "id" BIGSERIAL PRIMARY KEY,
  "numero" BIGINT,
  "capacidad" BIGINT,
  "estado" TEXT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pedido" (
  "id" BIGSERIAL PRIMARY KEY,
  "fecha_hora" TIMESTAMPTZ,
  "estado" TEXT,
  "cliente_id" BIGINT,
  "mesa_id" BIGINT,
  "pago_id" BIGINT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_pedido_cliente_id" ON "pedido" ("cliente_id");

CREATE INDEX IF NOT EXISTS "idx_pedido_mesa_id" ON "pedido" ("mesa_id");

CREATE INDEX IF NOT EXISTS "idx_pedido_pago_id" ON "pedido" ("pago_id");

CREATE TABLE IF NOT EXISTS "paquete_prepagado" (
  "id" BIGSERIAL PRIMARY KEY,
  "descripcion" TEXT,
  "saldo" DOUBLE PRECISION,
  "cliente_id" BIGINT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_paquete_prepagado_cliente_id" ON "paquete_prepagado" ("cliente_id");

CREATE TABLE IF NOT EXISTS "pago" (
  "id" BIGSERIAL PRIMARY KEY,
  "monto" DOUBLE PRECISION,
  "metodo" TEXT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "puntos" (
  "id" BIGSERIAL PRIMARY KEY,
  "cantidad" BIGINT,
  "cliente_id" BIGINT,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_puntos_cliente_id" ON "puntos" ("cliente_id");

CREATE TABLE IF NOT EXISTS "icase_records" (
  "id" BIGSERIAL PRIMARY KEY,
  "capability" TEXT NOT NULL,
  "extra" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_icase_records_capability" ON "icase_records" ("capability");

ALTER TABLE "platillo" ADD CONSTRAINT "fk_platillo_menu_id" FOREIGN KEY ("menu_id") REFERENCES "menu" ("id");

ALTER TABLE "platillo" ADD CONSTRAINT "fk_platillo_pedido_id" FOREIGN KEY ("pedido_id") REFERENCES "pedido" ("id");

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_cliente_id" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id");

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_mesa_id" FOREIGN KEY ("mesa_id") REFERENCES "mesa" ("id");

ALTER TABLE "pedido" ADD CONSTRAINT "fk_pedido_cliente_id" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id");

ALTER TABLE "pedido" ADD CONSTRAINT "fk_pedido_mesa_id" FOREIGN KEY ("mesa_id") REFERENCES "mesa" ("id");

ALTER TABLE "paquete_prepagado" ADD CONSTRAINT "fk_paquete_prepagado_cliente_id" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id");

ALTER TABLE "puntos" ADD CONSTRAINT "fk_puntos_cliente_id" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id");
