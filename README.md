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
    - Crea una copia del archivo `.env.development` y renómbralo a `.env.development`. Si lo deseas, puedes ajustar los valores, pero los predeterminados funcionan para el desarrollo local.
    - Para producción, crearías un archivo `.env.production` con los valores correspondientes.

4.  **Inicia el servidor en modo de desarrollo**:
    ```bash
    npm run start:dev
    ```

El backend ahora estará en funcionamiento en la URL configurada en tu archivo `.env.development` (por defecto, `http://localhost:3001`).

### 2. Frontend (Aplicación React)

Ahora, en una **nueva terminal**, inicia el servidor para el frontend.

1.  **Instala un servidor local simple**:
    Dado que la aplicación utiliza módulos de JavaScript (`import`), no se puede abrir directamente el archivo `index.html`. Usaremos `serve` para servir los archivos. Si no lo tienes, instálalo globalmente:
    ```bash
    npm install -g serve
    ```

2.  **Configura la Clave de API de Gemini**:
    La funcionalidad de transcripción de audio requiere una clave de API de Google Gemini.
    - Crea un archivo llamado `.env` en la raíz del proyecto (junto a `index.html`).
    - Añade tu clave de API: `API_KEY=TU_CLAVE_DE_API_AQUI`

3.  **Inicia el servidor del frontend**:
    Desde la carpeta raíz del proyecto, ejecuta:
    ```bash
    serve . -p 3000
    ```

Abre `http://localhost:3000` en tu navegador web para usar la aplicación. La aplicación frontend se conectará automáticamente al backend que se ejecuta en el puerto 3001.