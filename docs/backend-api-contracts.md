# Contratos Públicos del Backend

Este documento resume los endpoints expuestos por la API de NestJS tras la refactorización del punto 4.
Cada sección describe el propósito del módulo, los métodos disponibles y las respuestas esperadas.
Las rutas marcadas con 🔒 requieren un `Authorization: Bearer <token>` válido.

## Autenticación (`/auth`)
- `POST /auth/login`
  - **Descripción:** Verifica credenciales y devuelve un JWT.
  - **Body:** `{ "email": string, "password": string }`
  - **Respuesta 200:** `{ "access_token": string, "profile": UserProfile }`
- `POST /auth/register`
  - **Descripción:** Crea un usuario nuevo y entrega un JWT inicial.
  - **Body:** `{ "email": string, "password": string, "name": string }`
  - **Respuesta 201:** `{ "access_token": string, "profile": UserProfile }`

## Perfil (`/profile`)
- 🔒 `GET /profile`
  - **Descripción:** Recupera el perfil completo del usuario autenticado.
  - **Respuesta 200:** `UserProfile`
- 🔒 `PUT /profile`
  - **Descripción:** Sustituye el perfil del usuario con los datos proporcionados.
  - **Body:** `UpdateProfileDto`
  - **Respuesta 200:** `UserProfile`

## Usuarios (`/users`)
- 🔒 `GET /users/me`
  - **Descripción:** Devuelve la representación pública del usuario autenticado.
  - **Respuesta 200:** `PublicUser`
- 🔒 `GET /users/:id`
  - **Descripción:** Obtiene un usuario por id (sujeto a políticas de autorización adicionales cuando se implementen roles).
  - **Respuesta 200:** `PublicUser`

## Rondas (`/rounds`)
- 🔒 `GET /rounds`
  - **Descripción:** Lista todas las rondas registradas por el usuario.
  - **Respuesta 200:** `Round[]`
- 🔒 `GET /rounds/:id`
  - **Descripción:** Recupera una ronda específica del usuario.
  - **Respuesta 200:** `Round`
- 🔒 `POST /rounds`
  - **Descripción:** Crea una ronda nueva asociada al usuario autenticado.
  - **Body:** `CreateRoundDto`
  - **Respuesta 201:** `Round`
- 🔒 `PATCH /rounds/:id`
  - **Descripción:** Actualiza parcialmente una ronda existente.
  - **Body:** `UpdateRoundDto`
  - **Respuesta 200:** `Round`
- 🔒 `DELETE /rounds/:id`
  - **Descripción:** Elimina la ronda indicada.
  - **Respuesta 200:** `{ "status": "ok" }`

## Notas
- Las estructuras `UserProfile`, `PublicUser`, `Round`, `CreateRoundDto` y `UpdateRoundDto` están definidas en `backend/src/users` y `backend/src/rounds`.
- Cuando se migre a base de datos, las rutas se mantendrán, sustituyendo únicamente la implementación interna de los repositorios.
