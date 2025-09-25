# Plan de refactorización de App.tsx

## Objetivo
Separar responsabilidades de `App.tsx` en módulos especializados para mejorar el mantenimiento y la escalabilidad de la aplicación.

## Pasos
1. **Preparar dependencias y estructura de navegación**
   - Añadir `react-router-dom` para gestionar rutas declarativas.
   - Definir un layout principal con cabecera y zona de contenido con `<Outlet />`.

2. **Extraer la gestión de estado global en contextos dedicados**
   - Crear `AuthContext` que controle token, perfil, login, logout y modo invitado.
   - Implementar `ThemeContext` para sincronizar el tema con `localStorage` y el `<html>` root.
   - Crear `RoundsContext` que combine rondas de CSV y `localStorage`, y exponga operaciones de guardado/limpieza.

3. **Crear páginas por vista**
   - Convertir cada vista principal (`Nueva ronda`, `Perfil`, `Análisis`, etc.) en un componente de página que consuma los contextos en vez de recibir props desde `App`.
   - Extraer `MetronomeView` del archivo `App.tsx` y ubicarlo junto al resto de páginas.

4. **Actualizar componentes compartidos**
   - Ajustar `Header` y navegación secundaria para que usen el router en lugar de callbacks manuales.
   - Reemplazar alertas y navegación manual con hooks proporcionados por los contextos cuando sea necesario.

5. **Reescribir `App.tsx`**
   - Componer los proveedores de contexto y el enrutador en un componente limpio y declarativo.
   - Eliminar la lógica de negocio que ha sido movida a contextos/páginas.

6. **Verificar funcionalidad**
   - Ejecutar `npm run build` para asegurar que la refactorización compila.
   - Probar manualmente (cuando sea posible) los flujos críticos.

Cada paso se completará en orden, confirmando que la aplicación sigue funcionando después de implementar los cambios correspondientes.
