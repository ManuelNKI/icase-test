-- Migración 0002_auth: generada por I-CASE.
-- Se aplica automáticamente al iniciar el backend y se registra en schema_migrations.

CREATE TABLE IF NOT EXISTS "icase_users" (
  "id" BIGSERIAL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "nombre" TEXT NOT NULL DEFAULT '',
  "rol" TEXT NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_icase_users_email" ON "icase_users" ("email");
