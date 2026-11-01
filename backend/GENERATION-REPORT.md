# Informe de generación — GourmetFlow

Requisitos funcionales: 10. Con CRUD tipado: 5. Solo datos: 4. No soportados: 1.

- **CRUD tipado generado**: base de datos y operaciones con validaciones; no acredita todo el comportamiento del RF.
- **Solo datos**: solo se guardan y consultan registros; parte de lo pedido no se genera.
- **No soportado**: el requisito pide algo que el generador no produce y no hay entidad que lo sostenga.

| RF | Nombre | Nivel | Entidad | Reglas |
| --- | --- | --- | --- | --- |
| RF-01 | Visualización de menú digital | CRUD tipado generado | Menu | 0 |
| RF-02 | Reserva de mesa o silla | CRUD tipado generado | Reserva | 0 |
| RF-03 | Compra de paquetes semanales prepagados | CRUD tipado generado | PaquetePrepagado | 0 |
| RF-04 | Acumulación de puntos por compras | Solo datos | Puntos | 0 |
| RF-05 | Visualización de pedidos en tiempo real en cocina | Solo datos | Pedido | 0 |
| RF-06 | Marcado de platos agotados por cocina | No soportado | — | 0 |
| RF-07 | Visualización de mesas asignadas y toma de pedidos por meseros | CRUD tipado generado | Mesa | 0 |
| RF-08 | Validación de reserva mediante código QR | Solo datos | Reserva | 0 |
| RF-09 | Procesamiento de cobros y validación de planes prepagados | CRUD tipado generado | Cliente | 0 |
| RF-10 | Consulta de reportes de ventas y gestión de precios | Solo datos | Menu | 0 |

## Alcance funcional de la entrega

Modalidad: parcial. Estado: pendiente. Habilitada por alcance: sí.

No certificada: se evalúa el alcance de los generadores, no todas las reglas del negocio ni los RNF.

Requiere verificación técnica independiente para la huella actual de archivos.

**Los niveles de la tabla anterior describen la base CRUD y no certifican el RF.**

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

## Módulos

Modo: automatico.

- Datos por entidad — incluido (Va siempre.).
- Documentación OpenAPI — incluido (Va siempre.).
- Informe de generación — incluido (Va siempre.).
- Autenticación y roles — incluido (Aprobada en la etapa «Autenticación y roles».).
- App móvil (Expo) — incluido (La plataforma móvil está incluida en el alcance.).
- Formularios y tablas por campo — activo.
- Paginación, filtros y búsqueda — activo.
- Datos iniciales (seed deterministas) — activo.

## Qué falta en cada requisito

### RF-04 · Acumulación de puntos por compras (Solo datos)
- Se gestionan los datos de «Puntos» (alta, consulta, edición y baja).
- No se genera: cálculos y procesos de negocio. Los valores se escriben a mano; las reglas solo validan (requerido, único, rango, longitud, formato, comparación, estados, inmutable, valor por defecto) y no calculan.
- Detectado en descripción: «calcular».

### RF-05 · Visualización de pedidos en tiempo real en cocina (Solo datos)
- Se gestionan los datos de «Pedido» (alta, consulta, edición y baja).
- No se genera: tiempo real. Los datos se consultan al abrir o recargar la pantalla; no hay actualización automática ni canal de eventos.
- Detectado en nombre: «tiempo real».

### RF-06 · Marcado de platos agotados por cocina (No soportado)
- No se asoció a ninguna entidad del modelo de dominio: guarda registros con campos libres, sin validación de tipos.
- No se genera: tiempo real. Los datos se consultan al abrir o recargar la pantalla; no hay actualización automática ni canal de eventos.
- Detectado en descripción: «tiempo real».

### RF-08 · Validación de reserva mediante código QR (Solo datos)
- Se gestionan los datos de «Reserva» (alta, consulta, edición y baja).
- No se genera: cámara, códigos qr y biometría. No se accede al hardware del dispositivo; los códigos se escriben como texto.
- Detectado en nombre: «código QR».

### RF-10 · Consulta de reportes de ventas y gestión de precios (Solo datos)
- Se gestionan los datos de «Menu» (alta, consulta, edición y baja).
- No se genera: reportes, gráficos y exportación. Las listas muestran los registros tal cual; no se agregan, totalizan ni exportan.
- Detectado en nombre: «reportes».

## Capacidades pedidas que no se generan

- **Cálculos y procesos de negocio** — en RF-04. Los valores se escriben a mano; las reglas solo validan (requerido, único, rango, longitud, formato, comparación, estados, inmutable, valor por defecto) y no calculan.
- **Tiempo real** — en RF-05, RF-06 y en el stack (Socket.IO). Los datos se consultan al abrir o recargar la pantalla; no hay actualización automática ni canal de eventos.
- **Cámara, códigos QR y biometría** — en RF-08. No se accede al hardware del dispositivo; los códigos se escriben como texto.
- **Reportes, gráficos y exportación** — en RF-10. Las listas muestran los registros tal cual; no se agregan, totalizan ni exportan.

## Entidades sin requisito

Estas entidades del modelo tienen tabla pero ningún RF las usa, así que no tienen API ni pantalla: Platillo, Pago.

## Notas

- La app móvil es un paquete Expo (React Native) sin firmar: no es un APK ni un IPA instalable y solo se verificó su empaquetado para Android.
- 5 requisitos no funcionales: no se convierten en código ni se miden (rendimiento, disponibilidad, seguridad); como mucho influyen en la infraestructura propuesta.

## Límites de toda la aplicación generada

- La interfaz web muestra un formulario por campo y una tabla derivados del esquema de cada entidad, pero no reproduce el diseño de los mockups; una operación sin campos declarados se edita como JSON. La app móvil sigue usando JSON.
- Las listas en la API y en la interfaz soportan paginación (parámetros page y limit), búsqueda textual (parámetro search) y filtros por campo.
- Se generan datos iniciales (seed) deterministas derivados del esquema del modelo de dominio para pruebas de arranque.
- Los permisos son por rol y operación; no existe «propiedad» de registros (un usuario no queda limitado a los suyos).
- Si se vuelve a generar el código se pierden las ediciones manuales hechas en los archivos.

_Los niveles históricos describen CRUD generado, no cumplimiento funcional. Las palabras clave son sugerencias; confirma el alcance por RF. La ejecución y la cobertura se evalúan por separado._
