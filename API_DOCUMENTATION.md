# Documentación de la API (Backend)

Esta documentación describe los endpoints disponibles en la API del backend de Golf Master.

## URL Base

La API se ejecuta en `http://localhost:3001` en el entorno de desarrollo.

## Autenticación

La API utiliza JSON Web Tokens (JWT) para proteger los endpoints. Para acceder a las rutas protegidas, es necesario incluir el token en la cabecera de la petición de la siguiente manera:

`Authorization: Bearer <tu_jwt_token>`

---

## Módulo de Autenticación (`/auth`)

### 1. Registro de Usuario

-   **Endpoint**: `POST /auth/register`
-   **Descripción**: Crea un nuevo usuario. Actualmente, el almacenamiento de usuarios es en memoria, por lo que los usuarios no persistirán si el servidor se reinicia.
-   **Body (raw, JSON)**:
    ```json
    {
      "username": "nombredeusuario",
      "password": "unacontraseña"
    }
    ```
-   **Respuesta Exitosa (201 Created)**:
    ```json
    {
      "message": "Usuario registrado con éxito"
    }
    ```
-   **Respuesta de Error (409 Conflict)**:
    -   Si el nombre de usuario ya existe.

### 2. Inicio de Sesión

-   **Endpoint**: `POST /auth/login`
-   **Descripción**: Autentica a un usuario y devuelve un token de acceso y el perfil del usuario.
-   **Body (raw, JSON)**:
    ```json
    {
      "username": "nombredeusuario",
      "password": "unacontraseña"
    }
    ```
-   **Respuesta Exitosa (201 Created)**:
    ```json
    {
      "access_token": "ey...",
      "profile": {
        "name": "nombredeusuario",
        "hcpHistory": [
            { "date": "...", "hcp": 23.2 }
        ],
        "favoriteCourseIds": [],
        "trainingObjective": "recommended"
      }
    }
    ```
-   **Respuesta de Error (401 Unauthorized)**:
    -   Si las credenciales son incorrectas.

---

## Módulo de Perfil (`/profile`)

Este módulo requiere autenticación. Todas las peticiones deben incluir el token JWT.

### 1. Obtener Perfil de Usuario

-   **Endpoint**: `GET /profile`
-   **Descripción**: Devuelve el perfil del usuario autenticado.
-   **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "name": "nombredeusuario",
      "hcpHistory": [
          { "date": "...", "hcp": 23.2 }
      ],
      "favoriteCourseIds": ["course_id_1"],
      "trainingObjective": "consistency"
    }
    ```

### 2. Actualizar Perfil de Usuario

-   **Endpoint**: `PUT /profile`
-   **Descripción**: Actualiza el perfil del usuario autenticado.
-   **Body (raw, JSON)**:
    ```json
    {
      "name": "nombredeusuario",
      "hcpHistory": [
          { "date": "...", "hcp": 22.5 }
      ],
      "favoriteCourseIds": ["course_id_1", "course_id_2"],
      "trainingObjective": "distance"
    }
    ```
-   **Respuesta Exitosa (200 OK)**:
    -   El perfil actualizado.
    ```json
    {
      "name": "nombredeusuario",
      "hcpHistory": [
          { "date": "...", "hcp": 22.5 }
      ],
      "favoriteCourseIds": ["course_id_1", "course_id_2"],
      "trainingObjective": "distance"
    }
    ```
