# AGENTS.md: Gua para Agentes de IA

Este documento proporciona instrucciones esenciales para que los agentes de IA puedan trabajar de manera autnoma y consistente en este proyecto.

## 1. Configuracin del Entorno de Desarrollo (Setup commands)

El proyecto es una aplicacin full-stack. Es necesario configurar y ejecutar tanto el backend como el frontend en terminales separadas.

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
    - El proyecto ya incluye un archivo `.env.development` con valores predeterminados. No se requiere configuracin adicional para el desarrollo local.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run start:dev
    ```
    El backend se ejecutarǭ en `http://localhost:3001`.

### 1.2. Frontend (React + Vite)

1.  **Navegar al directorio raz del proyecto.**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar la clave de API de Gemini:**
    - Crea un archivo `.env.local` en el directorio raz.
    - Aade tu clave de API de Google Gemini con el siguiente formato:
      `VITE_GEMINI_API_KEY=TU_CLAVE_DE_API_AQUI`

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El frontend se ejecutarǭ normalmente en `http://localhost:5173`.

## 2. Ejecucin de Pruebas (Run tests)

### Backend

El backend estǭ configurado con Jest para las pruebas. Aunque no hay un script `test` definido en `package.json`, puedes ejecutar las pruebas de la siguiente manera:

1.  **Navega al directorio del backend:**
    ```bash
    cd backend
    ```

2.  **Ejecuta Jest:**
    ```bash
    npx jest
    ```
    Los archivos de prueba se encuentran principalmente en el directorio `backend/src` y tienen la extensin `.spec.ts`.

### Frontend

Actualmente, el proyecto frontend no cuenta con una suite de pruebas configurada.

## 3. Estilo de Cdigo y Convenciones (Code style)

- **Lenguaje:** El proyecto utiliza TypeScript tanto para el frontend (React) como para el backend (NestJS). Se deben seguir las convenciones estǭndar de TypeScript.
- **Formato:** No hay un formateador de cdigo (como Prettier) o un linter (como ESLint) configurado de forma explcita. Se recomienda mantener un estilo de cdigo consistente con el cdigo existente.

## 4. Estructura del Proyecto y Flujos de Trabajo (Project structure and workflows)

- `backend/`: Contiene la aplicacin NestJS.
  - `src/`: Lgica principal de la aplicacin, organizada por mdulos (autenticacin, usuarios, etc.).
  - `prisma/`: Contiene el esquema de la base de datos y las migraciones.
- `components/`: Componentes reutilizables de React.
- `pages/`: Componentes de React que representan las pǭginas de la aplicacin.
- `services/`: Lgica para interactuar con la API del backend.
- `hooks/`: Hooks personalizados de React.
- `router/`: Configuracin de las rutas de la aplicacin con React Router.

**Flujo de trabajo comǧn (ej. aǭadir una nueva funcionalidad):**
1.  **Backend:** Si es necesario, crea o modifica los endpoints de la API en el directorio `backend/src`. Actualiza el esquema de Prisma si hay cambios en el modelo de datos.
2.  **Frontend:**
    - Crea los nuevos componentes necesarios en `components/` o `pages/`.
    - Si es necesario, aǭade un nuevo servicio en `services/` para comunicarte con la API.
    - Aǭade la nueva ruta en `router/`.

## 5. Guas de Contribucin para la IA (Contribution guidelines for AI)

- **Mensajes de Commit:** Utiliza el formato "Conventional Commits". Por ejemplo: `feat: add user authentication` o `fix: resolve login bug`.
- **Ramas (Branches):** Crea ramas descriptivas para cada nueva funcionalidad o correccin. Por ejemplo: `feat/user-auth` o `fix/login-form`.
- **Sincronizacin de Documentacin:** Cualquier cambio en el cdigo debe reflejarse en la documentacin relevante (`README.md`, `API_DOCUMENTATION.md`, etc.).
