# Refactorización de App.tsx

## Objetivos
- Introducir un enrutador declarativo para separar las vistas.
- Extraer la gestión de autenticación fuera de `App.tsx`.
- Extraer la gestión de rondas y análisis a un contexto dedicado.
- Dividir las vistas en componentes de página con responsabilidades claras.
- Mantener comentarios breves en las partes clave para facilitar el mantenimiento.

## Pasos Propuestos
1. **Preparar dependencias y estructura** ✅
   - Añadir `react-router-dom` y crear una carpeta `pages` donde vivan las vistas principales.
   - Documentar los layouts y providers esperados.
2. **Crear contexto de autenticación** ✅
   - Implementar `AuthContext` con lógica para almacenar token, cargar perfil e iniciar/cerrar sesión.
   - Proveer hooks (`useAuth`) para consumir el estado.
3. **Crear contexto de rondas** ✅
   - Implementar `RoundsContext` para las rondas guardadas y la lógica de análisis (selección de ronda/curso, guardado).
   - Exponer un hook `useRounds`.
4. **Migrar vistas a componentes de página** ✅
   - Mover `MetronomeView`, `ProfileView`, `AnalysisView`, `TrainingGuideView`, `ClubhouseView`, `SettingsView`, y el flujo de nueva ronda a la carpeta `pages`.
   - Cada página debe consumir sus contextos y manejar su propia navegación secundaria.
5. **Configurar enrutamiento y layout** ✅
   - Reemplazar la lógica condicional de `App.tsx` por un árbol de `RouterProvider`, `AuthProvider`, `RoundsProvider` y un layout principal con el `Header`.
   - Definir rutas (`/`, `/metronome`, `/profile`, `/analysis`, `/analysis/course/:courseId`, `/analysis/round/:roundId`, `/settings`, `/training-guide`, `/clubhouse`).
   - Implementar rutas protegidas según el estado de autenticación.
6. **Ajustes finales y pruebas** ✅
   - Revisar comentarios, actualizar imports y limpiar estados obsoletos.
   - Ejecutar `npm run build` para asegurar que la refactorización compila.
