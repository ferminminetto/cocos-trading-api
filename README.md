# cocos-trading-api

# Setup

## Requisitos
- Node 20
- PostgreSQL (si corres local, crea dos DB: cocos_dev y cocos_test) o Docker

## Variables de entorno
Copiar `.env.example` a `.env` y ajustar (ver: [`.env.example`](./.env.example)).

## Local (sin Docker)
1. `npm install`
2. Crear DBs y extensiones (pg_trgm, unaccent) o ejecutar el contenido de:
   - [docker/initdb/001-init.sql](docker/initdb/001-init.sql)
3. (Opcional) Poblar datos de ejemplo ejecutando los seeds:
   - `psql -f docker/initdb/002-generate-dev.sql`
   - `psql -f docker/initdb/003-generate-test.sql`
4. Migraciones (si usas TypeORM migrations en dist):
   - `npm run migration:run`
5. Levantar en desarrollo:
   - `npm run start:dev`
6. Tests (usa TEST_DATABASE_URL):
   - `npm run test`
7. Swagger: http://localhost:3000/api/docs
8. Health: http://localhost:3000/api/health

## Docker
1. Copiar `.env.example` → `.env` (usar las URLs con host db)
2. `docker-compose up --build`
3. API en: http://localhost:3000
   - Swagger: /api/docs
   - Health: /api/health
(Seeds se cargan automáticamente vía scripts en [docker/initdb](docker/initdb))

### Notas
- Dos bases: cocos_dev (uso app) y cocos_test (tests). Los tests nunca modifican cocos_dev.

## Features y Decisiones técnicas

- Los cambios que se hicieron en la DB fueron
- - **Indices agregados** en instruments para la búsqueda por nombre de TICKER y/o Nombre
- - **Añadida la columna idempotence_key** en orders, para dar soporte a idempotencia de operaciones

- El proyecto esta dockerizado y puede probarse en el contenedor o corriendolo local. Se recomienda usar Docker para mas facilidad.
- - El proyecto está listo para CI/CD y despliegue en cualquier entorno compatible con Docker.

- El stack o librerias utilizadas fueron:
- - **NestJS** como framework web.
- - **decimal.js** para precision en algunos calculos monetarios.
- - **pino** para proveer logs  estructurados, especialmente en operaciones como crear orden.
- - **Swagger** para integrar una documentacion web y sencilla de la estructura general de la app.

- Se provee una coleccion de POSTMAN con los requests básicos para ser consumidos en **docs/cocos-trading-api.postman_collection.json**.

- Las respuestas de la API se encuentran en un formato estándarizado usando un GlobalFilter para envolverlas en dicho formato.

- **Manejo de Errores**: Los errores se formatean con el mismo envelope estándar mediante el GlobalHttpExceptionFilter. El logger (pino) registra code, message, statusCode y path. Si el cliente envía el `header x-trace-id`, este se propaga en la respuesta y en los logs para correlación (trazabilidad / observabilidad).

- Los DTO usan validadores para asegurar integridad y tipos.

- El proyecto posee tests unitarios y de integracion. El servicio de `order.service` posee la mayor cantidad de tests de integracion donde se busca probar que se cumpla la lógica de negocio.

- Para obtener el portfolio se priorizo una sola query raw para evitar multiples viajes a la DB. También se considero claridad y simplicidad. Partes como la obtenicon de dinero disponible fue creada como método de Repository para ser utilizada en Order y por algun otro modulo a futuro, pero la query principal del portfolio se usa una raw por estos motivos mencionados. Esto permite menor acoplamiento.

- La arquitectura modular permite agregar nuevos endpoints, entidades y lógica sin afectar el resto del sistema.

- **Idempotencia**: El `order.service` chequea que no se duplique una orden cuando recibe una idempotence_key.

- - Se utilizan dos bases de datos: **cocos_dev** para el uso normal de la aplicación y pruebas manuales, y **cocos_test** exclusivamente para la ejecución de tests automatizados. La base de datos de tests se limpia después de cada corrida para garantizar un entorno aislado y reproducible, mientras que cocos_dev mantiene los datos persistentes para desarrollo y pruebas funcionales.