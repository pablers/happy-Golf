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
-   `contexts/`: Contiene los contextos de React que gestionan el estado global, como `AuthContext` para la autenticación y `RoundsContext` para los datos de las rondas.
-   `services/`: Módulos responsables de la comunicación con servicios externos.
    -   `api.ts`: Centraliza toda la lógica para hacer peticiones a la API del backend (login, registro, perfiles, rondas).
    -   `audioService.ts`: Lógica para generar y procesar audio con la Web Audio API.
-   `hooks/`: Contiene hooks de React personalizados para encapsular lógica compleja, como `useMetronome.ts`.
-   `data/`: Almacena datos estáticos de la aplicación, como la configuración de los palos (`clubset.ts`), información de los campos de golf (`courses.ts`), y las preguntas del cuestionario (`questionnaireData.ts`).
-   `App.tsx`: Es el componente raíz que envuelve la aplicación con los proveedores de contexto y define el enrutamiento.
-   `index.tsx`: El punto de entrada de la aplicación React.
-   `vite.config.ts`: Archivo de configuración para Vite, el empaquetador y servidor de desarrollo.

### Flujo de Datos y Estado

-   **Gestión de Estado**: El estado se gestiona a través de Contextos de React. `AuthContext` maneja la sesión del usuario (token y perfil), mientras que `RoundsContext` se encarga de obtener, crear, actualizar y eliminar las rondas de golf a través de la API del backend.
-   **Persistencia Local**:
    -   El token de autenticación se guarda en `localStorage`.
    -   La configuración del tema (claro/oscuro) también se guarda en `localStorage`.
    -   Los datos de rondas y perfiles de usuario ya no se guardan localmente; se obtienen directamente del backend.
-   **Datos Externos**: Todos los datos dinámicos (perfiles, rondas, etc.) se obtienen del backend a través del servicio `api.ts`. Ya no se carga ningún dato desde archivos CSV en el cliente.

---

## Backend (NestJS)

El backend está ubicado en el directorio `backend/`.

### Estructura de Directorios Clave

-   `src/`: Contiene todo el código fuente del backend.
    -   `main.ts`: El punto de entrada de la aplicación NestJS. Aquí se inicia el servidor.
    -   `app.module.ts`: El módulo raíz que importa y configura los demás módulos de la aplicación.
    -   `prisma/`: Contiene el `PrismaService` para la interacción con la base de datos y el `PrismaModule`.
    -   `auth/`: Módulo de NestJS que encapsula toda la lógica de autenticación (login, registro, estrategias JWT).
    -   `profile/`: Módulo para gestionar los perfiles de usuario (obtener y actualizar).
    -   `users/`: Módulo para la gestión de usuarios, principalmente para dar soporte a la autenticación y la creación de perfiles.
    -   `rounds/`: Nuevo módulo que contiene el `RoundsController` y `RoundsService` para gestionar las operaciones CRUD de las rondas de golf.
-   `prisma/`: Contiene el esquema de la base de datos (`schema.prisma`) y el script de migración (`seed.ts`).
-   `.env`: Archivo de configuración para las variables de entorno, incluyendo la cadena de conexión a la base de datos.
-   `nest-cli.json`: Archivo de configuración para el CLI de NestJS.
-   `package.json`: Define las dependencias y scripts del backend.

### Flujo de Datos y Lógica de Negocio

-   **Autenticación**: Utiliza un sistema basado en JSON Web Tokens (JWT). El usuario envía sus credenciales, y si son válidas, el servidor devuelve un JWT que el cliente debe incluir en las cabeceras de las peticiones a rutas protegidas.
-   **Gestión de Perfiles y Rondas**: Proporciona endpoints RESTful para que un usuario autenticado pueda gestionar su perfil y sus rondas de golf.
-   **Persistencia**: La aplicación ahora utiliza una base de datos PostgreSQL para persistir todos los datos de usuarios, perfiles y rondas. La interacción con la base de datos se gestiona a través del ORM Prisma. Los datos ya no se almacenan en memoria, garantizando la persistencia entre reinicios del servidor.
-   **Migración de Datos**: Se incluye un script de `seed` en `prisma/seed.ts` que lee los datos históricos del archivo `registro-partidas.csv` y los campos de golf de `data/courses.ts` para poblar la base de datos inicial. Este script se puede ejecutar con `npm run seed`.