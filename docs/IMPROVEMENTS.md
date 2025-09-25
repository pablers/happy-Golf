# Propuestas de Mejora y Próximos Pasos

Este documento describe una serie de mejoras recomendadas para la base de código de Golf Master. Estas propuestas están orientadas a mejorar la mantenibilidad, escalabilidad y experiencia de desarrollo del proyecto.

## 1. Refactorización del Frontend

### Problema
Actualmente, el componente `App.tsx` es un "mega componente" que gestiona casi toda la lógica de la aplicación:
- Enrutamiento entre vistas.
- Gestión de estado global (autenticación, perfil de usuario, rondas, etc.).
- Lógica de negocio para la configuración de rondas.

Este enfoque dificulta la lectura, el mantenimiento y la adición de nuevas funcionalidades.

### Solución Propuesta
-   **Implementar un Enrutador (Router)**: Introducir una biblioteca de enrutamiento como `react-router-dom`. Esto permitiría definir rutas claras para cada vista (`/`, `/metronome`, `/profile`, `/analysis/:roundId`, etc.) en lugar de usar un `switch` sobre una variable de estado.
-   **Separar la Gestión de Estado**: Extraer la lógica de estado fuera de `App.tsx`.
    -   **Estado de Autenticación**: Gestionar el estado del usuario y el token a través de un `AuthContext`.
    -   **Estado de Rondas**: Crear un `RoundsContext` o utilizar una biblioteca de gestión de estado (como Zustand o Redux Toolkit) para manejar la carga, guardado y análisis de rondas.
    -   **Componentes Independientes**: Cada vista (`ProfileView`, `AnalysisView`, etc.) se convertiría en un componente de página que obtendría los datos que necesita del contexto o de la biblioteca de estado, en lugar de recibirlos como props desde `App.tsx`.

## 2. Centralización de la Lógica de Datos en el Backend

### Problema
La lógica de datos está actualmente fragmentada:
- El backend gestiona los perfiles de usuario (en memoria).
- El frontend gestiona las rondas de golf, guardándolas en `localStorage`.
- El frontend también carga datos históricos desde un archivo CSV (`registro-partidas.csv`).

Esto crea múltiples "fuentes de la verdad" y hace que los datos no sean consistentes ni accesibles desde diferentes dispositivos.

### Solución Propuesta
-   **Crear Endpoints para Rondas**: Añadir endpoints en el backend para crear, leer, actualizar y eliminar rondas de golf (`POST /rounds`, `GET /rounds`, etc.).
-   **Implementar una Base de Datos**: Reemplazar el almacenamiento en memoria del backend con una base de datos real (por ejemplo, PostgreSQL con Prisma, o una base de datos NoSQL como MongoDB). Esto garantizaría la persistencia de los datos de usuarios y rondas.
-   **Migrar Datos**: Crear un script para migrar los datos del archivo `registro-partidas.csv` a la nueva base de datos.
-   **Actualizar el Frontend**: Modificar el frontend para que obtenga y guarde todas las rondas a través de la API del backend, eliminando la dependencia de `localStorage` y del archivo CSV para este propósito.

## 3. Mejoras en la Experiencia de Desarrollo (DX)

### Problema
Durante el desarrollo, el frontend (que corre, por ejemplo, en `localhost:5173`) necesita hacer peticiones al backend (en `localhost:3001`). Esto requiere configurar CORS en el backend y escribir URLs completas en el código del frontend, lo cual es propenso a errores.

### Solución Propuesta
-   **Configurar un Proxy en Vite**: Añadir una configuración de proxy en `vite.config.ts`. Esto permitiría que el frontend haga peticiones a su propio servidor de desarrollo (ej. `fetch('/api/profile')`), y Vite se encargaría de redirigir esas peticiones al backend.

    ```typescript
    // vite.config.ts
    export default defineConfig({
      // ...
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
    });
    ```
    Esto simplificaría el código de `services/api.ts` y eliminaría la necesidad de configuraciones de CORS complejas para el desarrollo.

## 4. Mejoras en el Backend

### Problema
-   El `profile.controller.ts` contiene lógica de negocio que debería estar en un servicio.
-   El `users.service` es utilizado por el módulo de autenticación, pero la gestión de usuarios podría ser un módulo más completo.

### Solución Propuesta
-   **Separar Lógica en Servicios**: Crear un `ProfileService` para manejar la lógica de negocio relacionada con los perfiles, manteniendo el controlador delgado y centrado en manejar las peticiones HTTP.
-   **Refinar Módulos**: Asegurar que cada módulo de NestJS tenga una responsabilidad clara y siga las mejores prácticas del framework (controladores, servicios, módulos bien definidos).
