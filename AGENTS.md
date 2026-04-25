# AGENTS.md: Guía para Agentes de IA

Este documento proporciona instrucciones esenciales para que los agentes de IA puedan trabajar de manera autónoma y consistente en este proyecto.

## 1. Configuración del Entorno de Desarrollo (Setup commands)

El proyecto es una aplicación full-stack. Es necesario configurar y ejecutar tanto el backend como el frontend en terminales separadas.

### 1.1. Backend (API NestJS)

1.  **Navegar al directorio del backend:**
    ```bash
    cd backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    - El proyecto ya incluye un archivo `.env.development` con valores predeterminados. No se requiere configuración adicional para el desarrollo local.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run start:dev
    ```
    El backend se ejecutará en `http://localhost:3001`.

### 1.2. Frontend (React + Vite)

1.  **Navegar al directorio raíz del proyecto.**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar la clave de API de Gemini:**
    - Crea un archivo `.env.local` en el directorio raíz.
    - Añade tu clave de API de Google Gemini con el siguiente formato:
      `VITE_GEMINI_API_KEY=TU_CLAVE_DE_API_AQUI`

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El frontend se ejecutará normalmente en `http://localhost:5173`.

## 2. Ejecución de Pruebas (Run tests)

### Backend

El backend está configurado con Jest para las pruebas. Aunque no hay un script `test` definido en `package.json`, puedes ejecutar las pruebas de la siguiente manera:

1.  **Navega al directorio del backend:**
    ```bash
    cd backend
    ```

2.  **Ejecuta Jest:**
    ```bash
    npx jest
    ```
    Los archivos de prueba se encuentran principalmente en el directorio `backend/src` y tienen la extensión `.spec.ts`.

### Frontend

Actualmente, el proyecto frontend no cuenta con una suite de pruebas configurada.

## 3. Estilo de Código y Convenciones (Code style)

- **Lenguaje:** El proyecto utiliza TypeScript tanto para el frontend (React) como para el backend (NestJS). Se deben seguir las convenciones estándar de TypeScript.
- **Formato:** No hay un formateador de código (como Prettier) o un linter (como ESLint) configurado de forma explícita. Se recomienda mantener un estilo de código consistente con el código existente.

## 4. Estructura del Proyecto y Flujos de Trabajo (Project structure and workflows)

- `backend/`: Contiene la aplicación NestJS.
  - `src/`: Lógica principal de la aplicación, organizada por módulos (autenticación, usuarios, etc.).
  - `prisma/`: Contiene el esquema de la base de datos y las migraciones.
- `components/`: Componentes reutilizables de React.
- `pages/`: Componentes de React que representan las páginas de la aplicación.
- `services/`: Lógica para interactuar con la API del backend.
- `hooks/`: Hooks personalizados de React.
- `router/`: Configuración de las rutas de la aplicación con React Router.

**Flujo de trabajo común (ej. añadir una nueva funcionalidad):**
1.  **Backend:** Si es necesario, crea o modifica los endpoints de la API en el directorio `backend/src`. Actualiza el esquema de Prisma si hay cambios en el modelo de datos.
2.  **Frontend:**
    - Crea los nuevos componentes necesarios en `components/` o `pages/`.
    - Si es necesario, añade un nuevo servicio en `services/` para comunicarte con la API.
    - Añade la nueva ruta en `router/`.

## 5. Guías de Contribución para la IA (Contribution guidelines for AI)

- **Mensajes de Commit:** Utiliza el formato "Conventional Commits". Por ejemplo: `feat: add user authentication` o `fix: resolve login bug`.
- **Ramas (Branches):** Crea ramas descriptivas para cada nueva funcionalidad o corrección. Por ejemplo: `feat/user-auth` o `fix/login-form`.
- **Sincronización de Documentación:** Cualquier cambio en el código debe reflejarse en la documentación relevante (`README.md`, `API_DOCUMENTATION.md`, etc.).
