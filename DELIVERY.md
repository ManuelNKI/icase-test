# GourmetFlow

Paquete generado por I-CASE a partir de artefactos aprobados y verificados.

- codigo_backend: versión 2
- codigo_frontend: versión 2
- pruebas: versión 2
- infraestructura: versión 2
- pipeline_ci_cd: versión 2

## Inicio rápido

1. Revisa `delivery-manifest.json` y la evidencia de verificación de cada artefacto.
2. Configura `ops/.env` desde `ops/.env.example`.
3. Ejecuta `docker compose -f ops/docker-compose.yml up --build`.
4. Consulta los detalles de pruebas y CI/CD en sus respectivos README.
5. La API está documentada en `backend/openapi.json` (OpenAPI 3.1; ábrelo en Swagger UI o Redoc) y, con el servicio en marcha, en `GET /api/openapi.json`.
6. Lee `backend/GENERATION-REPORT.md`: indica qué se generó completo de cada requisito, qué quedó solo con datos y qué no se generó.
7. Para la app móvil, configura `mobile/.env` desde `mobile/.env.example` con una URL accesible desde el dispositivo y sigue `mobile/README.md`. El bundle Expo no es un APK/IPA firmado.

## Alcance declarado

Entrega **parcial**. No certificada: se evalúa el alcance de los generadores, no todas las reglas del negocio ni los RNF.

- RF-01: Falta confirmar el alcance de la versión actual del RF.
- RF-02: Falta confirmar el alcance de la versión actual del RF.
- RF-03: Falta confirmar el alcance de la versión actual del RF.
- RF-04: Falta confirmar el alcance de la versión actual del RF.
- RF-04: Capacidades sin implementación: calculos.
- RF-05: Falta confirmar el alcance de la versión actual del RF.
- RF-05: Capacidades sin implementación: tiempo_real.
- RF-06: Falta confirmar el alcance de la versión actual del RF.
- RF-06: No hay operación asociada por identificador a una entidad tipada.
- RF-06: Capacidades sin implementación: tiempo_real.
- RF-07: Falta confirmar el alcance de la versión actual del RF.
- RF-08: Falta confirmar el alcance de la versión actual del RF.
- RF-08: Capacidades sin implementación: dispositivos.
- RF-09: Falta confirmar el alcance de la versión actual del RF.
- RF-10: Falta confirmar el alcance de la versión actual del RF.
- RF-10: Capacidades sin implementación: reportes.
- El stack solicita tiempo real y todavía no existe ese módulo.
