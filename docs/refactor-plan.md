# Plan de refactorización por etapas

## Objetivo general
Reducir el acoplamiento actual en `App.tsx` separando el enrutamiento, la gestión de estado global y las vistas, manteniendo el comportamiento existente de la aplicación.

## Fases propuestas

1. **Preparar infraestructura de enrutamiento y contexto**
   - Añadir `react-router-dom` al proyecto.
   - Crear una carpeta `contexts/` para alojar los nuevos providers.

2. **Extraer la lógica de autenticación**
   - Crear `AuthContext` con estado de token, perfil y acciones (`login`, `logout`, `skipLogin`).
   - Migrar los efectos de validación de token y carga de perfil desde `App.tsx` al provider.

3. **Extraer la gestión de tema y rounds persistidos**
   - Crear `ThemeContext` que encapsule sincronización con `localStorage`.
   - Crear `RoundsContext` que gestione carga, guardado y análisis de rondas (incluye importación CSV existente).

4. **Dividir vistas en componentes de página**
   - Mover `MetronomeView` a `components/pages/MetronomePage.tsx`.
   - Crear páginas para cada vista actual (`NewRoundPage`, `ProfilePage`, `AnalysisPage`, etc.) reutilizando los componentes existentes.

5. **Configurar el router principal**
   - Reescribir `App.tsx` para que únicamente orqueste providers y `Router` con rutas declarativas.
   - Actualizar `Header`/navegación para utilizar enlaces de `react-router-dom`.

6. **Verificar comportamiento y limpiar**
   - Comprobar que las rutas y contextos proporcionan los datos esperados.
   - Eliminar lógica redundante que quede en `App.tsx`.

Cada fase dependerá de la anterior para mantener la aplicación operativa en todo momento.

## Estado de ejecución

- [x] Fase 1
- [x] Fase 2
- [x] Fase 3
- [x] Fase 4
- [x] Fase 5
- [x] Fase 6
