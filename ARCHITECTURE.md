# Arquitectura de la Aplicación

Este documento proporciona una visión general de la arquitectura técnica de la aplicación Golf Master, dividida en sus dos componentes principales: el Frontend y el Backend.

## Visión General

La aplicación sigue una arquitectura cliente-servidor:

-   **Frontend**: Una Single-Page Application (SPA) construida con React y Vite. Es la interfaz con la que interactúa el usuario. Se encarga de la presentación, la interactividad y la comunicación con el backend.
-   **Backend**: Una API RESTful construida con Node.js y el framework NestJS. Se encarga de la lógica de negocio, la persistencia de datos y la autenticación de usuarios.

Ambas partes están desacopladas y se comunican a través de peticiones HTTP.

---

## Frontend (React + Vite)

El frontend está ubicado en la raíz del proyecto.

### Estructura de Directorios Clave

-   `components/`: Contiene todos los componentes de React reutilizables (`Header`, `Scorecard`, `ClubSelector`, etc.). Están diseñados para ser modulares y, en su mayoría, centrados en la UI.
-   `services/`: Módulos responsables de la comunicación con servicios externos.
    -   `api.ts`: Centraliza toda la lógica para hacer peticiones a la API del backend (login, registro, perfiles).
    -   `audioService.ts`: Lógica para generar y procesar audio con la Web Audio API.
    -   `roundImporter.ts`: Lógica para cargar y parsear datos de rondas desde un archivo CSV local.
-   `hooks/`: Contiene hooks de React personalizados para encapsular lógica compleja, como `useMetronome.ts`.
-   `data/`: Almacena datos estáticos de la aplicación, como la configuración de los palos (`clubset.ts`), información de los campos de golf (`courses.ts`), y las preguntas del cuestionario (`questionnaireData.ts`).
-   `App.tsx`: Es el componente raíz que gestiona el estado principal de la aplicación, la autenticación y el enrutamiento entre las diferentes vistas.
-   `index.tsx`: El punto de entrada de la aplicación React.
-   `vite.config.ts`: Archivo de configuración para Vite, el empaquetador y servidor de desarrollo.

### Flujo de Datos y Estado

-   **Gestión de Estado**: El estado principal (vista activa, perfil de usuario, datos de la ronda actual) se gestiona en el componente `App.tsx` a través de los hooks `useState` y `useEffect` de React.
-   **Persistencia Local**:
    -   El token de autenticación se guarda en `localStorage`.
    -   Las rondas de golf completadas por el usuario se guardan en `localStorage` para persistir entre sesiones.
    -   La configuración del tema (claro/oscuro) también se guarda en `localStorage`.
-   **Datos Externos**: La aplicación carga un historial de rondas desde un archivo `registro-partidas.csv` ubicado en `data/`. Estos datos se combinan con las rondas guardadas localmente.

---

## Backend (NestJS)

El backend está ubicado en el directorio `backend/`.

### Estructura de Directorios Clave

-   `src/`: Contiene todo el código fuente del backend.
    -   `main.ts`: El punto de entrada de la aplicación NestJS. Aquí se inicia el servidor.
    -   `app.module.ts`: El módulo raíz que importa y configura los demás módulos de la aplicación.
    -   `auth/`: Módulo de NestJS que encapsula toda la lógica de autenticación.
        -   `auth.controller.ts`: Define las rutas para el login y el registro (`/auth/login`, `/auth/register`).
        -   `auth.service.ts`: Contiene la lógica para validar usuarios y firmar tokens JWT.
        -   `strategies/`: Implementaciones de estrategias de Passport.js (JWT y local).
        -   `guards/`: Guards para proteger rutas que requieren autenticación.
    -   `profile/`: Módulo para gestionar los perfiles de usuario.
        -   `profile.controller.ts`: Define las rutas para obtener y actualizar el perfil (`/profile`).
        -   (No hay `profile.service.ts`, la lógica está en el controlador, lo cual es un área de mejora).
    -   `users/`: Módulo para la gestión de usuarios (aunque principalmente proporciona un `users.service` para la autenticación).
-   `.env.development` / `.env.production`: Archivos de configuración para las variables de entorno.
-   `nest-cli.json`: Archivo de configuración para el CLI de NestJS.
-   `package.json`: Define las dependencias y scripts del backend.

### Flujo de Datos y Lógica de Negocio

-   **Autenticación**: Utiliza un sistema basado en JSON Web Tokens (JWT). El usuario envía sus credenciales, y si son válidas, el servidor devuelve un JWT que el cliente debe incluir en las cabeceras de las peticiones a rutas protegidas.
-   **Gestión de Perfiles**: Proporciona endpoints para que un usuario autenticado pueda obtener y actualizar su información de perfil (HCP, campo favorito, etc.).
-   **Persistencia**: El código actual no incluye una conexión a una base de datos. El `users.service` utiliza una lista de usuarios en memoria, lo que significa que los datos se pierden si el servidor se reinicia. Esta es una de las principales áreas de mejora.
