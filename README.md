# Golf Master: Metrónomo y Tarjeta de Puntuación Inteligente

Esta es una aplicación web avanzada para golfistas diseñada para mejorar tanto el entrenamiento del ritmo como el análisis del rendimiento en el campo. La aplicación combina un metrónomo de swing de alta precisión con una tarjeta de puntuación digital que recopila datos de forma inteligente a través de un sistema de preguntas dinámicas.

## Arquitectura

Esta aplicación es un proyecto full-stack:
- **Frontend**: Una aplicación de página única (SPA) construida con React y TypeScript.
- **Backend**: Una API RESTful construida con Node.js y el framework NestJS, encargada de la autenticación y la gestión de datos de usuario.

## Características Principales

- **Autenticación Segura**: Sistema de registro e inicio de sesión de usuarios con JWT.
- **Gestión de Perfil Persistente**: Los datos del perfil del jugador se guardan de forma segura en el backend.
- **Metrónomo de Swing Profesional**: Tempo ajustable por tipo de palo con guía de rango óptimo.
- **Tarjeta de Puntuación Digital Completa**: Registro de golpes, putts y cálculo de puntuación neta con HCP.
- **Cuestionario Dinámico e Inteligente**: Un motor de lógica que lanza preguntas contextuales basadas en el rendimiento del jugador.
- **Análisis de Rondas Post-Partida**: Visualización detallada del rendimiento con gráficos y mapas de calor.

Para una descripción más detallada de cada funcionalidad, consulta el archivo [FEATURES.md](FEATURES.md).

## Cómo Iniciar el Proyecto desde el Terminal

Para ejecutar esta aplicación en tu entorno de desarrollo local, necesitas ejecutar tanto el frontend como el backend.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y npm.

### 1. Backend (API NestJS)

Primero, configura e inicia el servidor de backend.

1.  **Navega al directorio del backend**:
    ```bash
    cd backend
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno**:
    - El proyecto incluye un archivo `backend/.env.development` con valores predeterminados para el desarrollo local. Asegúrate de que este archivo contenga las variables necesarias, como `JWT_SECRET` y `CORS_ORIGIN`.

4.  **Inicia el servidor en modo de desarrollo**:
    ```bash
    npm run start:dev
    ```
    > **Nota:** Este es el único comando que necesitas para el desarrollo del backend. Se encarga de compilar el código y reiniciar el servidor automáticamente cuando detecta cambios. No es necesario ejecutar `npm run build`.

El backend ahora estará en funcionamiento en la URL configurada en tu archivo `.env.development` (por defecto, `http://localhost:3001`).

### 2. Frontend (Aplicación React con Vite)

Ahora, en una **nueva terminal**, inicia el servidor de desarrollo para el frontend.

1.  **Navega a la raíz del proyecto** (si no estás ya ahí).

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno del Frontend**:
    - Crea un archivo llamado `.env.local` en la raíz del proyecto (junto a `index.html`).
    - Añade tu clave de API con el prefijo que espera Vite: `VITE_GEMINI_API_KEY=TU_CLAVE_DE_API_AQUI`.
    - (Opcional en local) Define `VITE_API_URL=http://localhost:3001` para personalizar el destino del proxy de desarrollo si tu backend usa otra dirección.

4.  **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

Vite iniciará el servidor de desarrollo (normalmente en `http://localhost:5173`) y abrirá la aplicación en tu navegador. Gracias al proxy configurado, todas las llamadas a `/api` se redirigen automáticamente al backend que se ejecute en la URL definida por `VITE_API_URL` (por defecto, `http://localhost:3001`). Si tu backend ya expone las rutas bajo el prefijo `/api` (como hace NestJS con `app.setGlobalPrefix('api')`), no es necesario reescribir la ruta en el proxy: bastará con usar el mismo prefijo en el frontend.

### Variables de entorno en producción (Vercel)

Cuando despliegues la SPA en Vercel, define la variable `VITE_API_URL` en los entornos **Development**, **Preview** y **Production** para indicar la URL base del backend:

- Si el backend se publica en un dominio propio, establece `VITE_API_URL=https://tu-backend/api` (ajusta el dominio según tu despliegue).
- Para la infraestructura actual del proyecto, usa `VITE_API_URL=https://backend.sophox.es`.

Con esta variable, la SPA enviará las peticiones directamente al dominio del backend sin depender de un reverse proxy adicional. Mantener el valor sin definir dejará activa la ruta relativa `/api`, útil si configuras un rewrite en `vercel.json` o utilizas el proxy integrado durante el desarrollo local.

> ✅ Tras cada despliegue, valida que `https://www.sophox.es/api/auth/login` (o el dominio que corresponda) devuelve la respuesta del backend para confirmar que la variable está bien configurada.
