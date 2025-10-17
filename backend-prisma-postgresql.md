# Plan de integración Backend + Prisma + PostgreSQL

Este documento desglosa las tareas necesarias para reemplazar el almacenamiento en memoria del backend NestJS por una conexión real a PostgreSQL usando Prisma. Cada tarea describe su objetivo, los pasos a ejecutar en orden y los requerimientos externos que se deben tener listos antes de avanzar.

## Tarea 1. Verificar el estado del entorno ✅
Objetivo: asegurar que dependencias, variables y migraciones estén listas antes de tocar el código.
1. Revisar que `backend/package.json` contenga `@prisma/client` y `prisma` en `devDependencies`. Si faltan, instalarlos con `npm install @prisma/client prisma` dentro de `backend/`.
   - Requerimientos: acceso a internet para descargar paquetes.
2. Confirmar que `.env.development` y `.env` (si aplica) definan `DATABASE_URL` apuntando a la instancia de PostgreSQL deseada.
   - Requerimientos: credenciales válidas y conectividad a la base.
3. Ejecutar `npx prisma migrate deploy` (o `prisma migrate dev` si se desea trabajar con migraciones locales) seguido de `npx prisma db seed` para asegurar que el esquema y los datos iniciales estén sincronizados.
   - Requerimientos: base de datos accesible; archivos en `backend/prisma/` intactos.

## Tarea 2. Crear el módulo Prisma reutilizable ✅
Objetivo: exponer un `PrismaService` centralizado para inyectarlo en el resto del backend.
1. Generar `backend/src/prisma/prisma.module.ts` que exporte `PrismaService` como provider y module global (usa `@Global()` si se quiere evitar imports repetidos).
   - Requerimientos: organización estándar de módulos NestJS.
2. Implementar `backend/src/prisma/prisma.service.ts` extendiendo `PrismaClient` e implementando `OnModuleInit` y `OnModuleDestroy` para abrir/cerrar la conexión.
   - Requerimientos: buenas prácticas NestJS, tipos de Prisma generados.
3. Añadir `PrismaModule` a la lista de imports de `AppModule` o de los módulos que necesiten acceso (por ejemplo `UsersModule`, `AuthModule`, `ProfilesModule`).
   - Requerimientos: visibilidad de módulos NestJS.

## Tarea 3. Sustituir el almacenamiento en memoria en UsersService ✅
Objetivo: migrar la lógica de usuarios al acceso mediante Prisma.
1. Localizar el servicio actual (p.ej. `backend/src/users/users.service.ts`) y eliminar el arreglo en memoria junto con la lógica asociada.
   - Requerimientos: conocimiento del servicio existente.
2. Inyectar `PrismaService` en el constructor y reescribir métodos como `findOneByEmail`, `create`, `update`, `findAll` para que utilicen `prisma.user` y relaciones (`include`/`select`) necesarias para perfiles.
   - Requerimientos: tipos de datos Prisma generados; modelo actualizado (`backend/prisma/schema.prisma`).
3. Ajustar DTOs y entidades (`backend/src/users/dto/*`, `backend/src/users/entities/*`) para reflejar campos reales (IDs, timestamps) y eliminar estructuras que solo tenían sentido en memoria.
   - Requerimientos: consistencia en tipado; revisar endpoints dependientes.

## Tarea 4. Actualizar módulos dependientes (auth, perfiles, etc.) ✅
Objetivo: garantizar que autenticación y otros módulos consuman los datos persistentes correctamente.
1. En `backend/src/auth/auth.service.ts`, reemplazar cualquier referencia al store en memoria por consultas Prisma (p.ej. `prisma.user.findUnique`).
   - Requerimientos: DTOs actualizados de la tarea anterior; manejo de contraseñas usando los mismos helpers de hashing.
2. Revisar `ProfilesModule`, `RoundsModule` u otros módulos que usen usuarios para asegurar que consulten mediante Prisma y respeten las relaciones definidas.
   - Requerimientos: revisar dependencias cruzadas; actualizar imports.
3. Ejecutar pruebas manuales de login y lectura de perfiles para validar que la autenticación usa la base real.
   - Requerimientos: servidor backend corriendo (`npm run start:dev`) y base de datos con datos seed.

## Tarea 5. Instrumentar manejo de errores y transacciones ✅
Objetivo: robustecer la integración nueva para producción.
1. Envolver operaciones críticas en bloques `try/catch` que capturen errores de Prisma (`PrismaClientKnownRequestError`) y los traduzcan a excepciones HTTP adecuadas (`ConflictException`, `NotFoundException`, etc.).
   - Requerimientos: importar `Prisma` desde `@prisma/client` para usar enums de errores.
2. Utilizar transacciones (`prisma.$transaction`) cuando se creen usuarios junto con perfiles o entidades relacionadas.
   - Requerimientos: entender los flujos que modifican múltiples tablas.
3. Configurar logs personalizados en `PrismaService` (propiedad `log`) o en NestJS `Logger` para monitorear eventos de conexión y errores recurrentes.
   - Requerimientos: políticas de logging acordadas.

## Tarea 6. Validar y documentar la integración ✅
Objetivo: asegurar que el equipo conozca el nuevo flujo y que no queden cabos sueltos.
1. Ejecutar pruebas automatizadas disponibles (`npx jest` en `backend/`) y, si no existen, documentar pruebas manuales realizadas (login, consulta de perfiles, creación de usuarios). Se registró el smoke test manual posterior a la migración en el README del backend.
   - Requerimientos: entorno de pruebas funcional.
2. Actualizar documentación relevante (`README.md`, `docs/`, guías internas) mencionando cómo levantar la base, correr migraciones y seed.
   - Requerimientos: alineación con la estructura de documentación del proyecto.
3. Registrar incidencias o TODOs detectados durante la migración para iteraciones futuras (p.ej. optimizar consultas, crear índices, refactorizar DTOs adicionales). El seguimiento se añadió en `docs/IMPROVEMENTS.md`.
   - Requerimientos: sistema de seguimiento (issue tracker) o notas internas.

Con estas tareas completadas en orden, el backend quedará usando Prisma y PostgreSQL de forma consistente, manteniendo el código modular, limpio y alineado con las mejores prácticas del proyecto.
