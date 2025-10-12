# Plan de Refactorización del Backend

## Evaluación del Punto 4 de `docs/IMPROVEMENTS.md`
- El diagnóstico es acertado: actualmente el `profile.controller.ts` mezcla responsabilidades al manejar reglas de negocio directamente, lo que complica las pruebas y el mantenimiento.
- También es pertinente la sugerencia de modularizar mejor `users.service`, ya que la capa de autenticación depende de él y conviene aislar la lógica de usuarios para favorecer la reutilización.

## Objetivos de la Separación Modular
1. **Claridad de responsabilidades**: cada módulo debe exponer un contrato bien definido y delegar la lógica compleja a sus servicios.
2. **Reutilización y extensibilidad**: separar perfiles, usuarios y autenticación permite evolucionar cada área sin afectar a las demás.
3. **Pruebas más simples**: aislar servicios facilita escribir pruebas unitarias al poder simular dependencias específicas.

## Propuesta de Módulos
- **CoreModule**: exporta proveedores comunes (por ejemplo, PrismaService o configuraciones compartidas).
- **UsersModule**:
  - `UsersController` (si se exponen rutas públicas o administrativas).
  - `UsersService`: responsable de CRUD de usuarios y de exponer operaciones que necesiten otros módulos.
  - Repositorio o adaptadores para la capa de persistencia si se amplía la integración con base de datos.
- **AuthModule**:
  - `AuthController` y `AuthService` centrados en login, registro y renovación de tokens.
  - Inyecta `UsersService` para validar credenciales y gestionar claims, manteniendo un acoplamiento explícito.
- **ProfileModule**:
  - `ProfileController` reducido a orquestar peticiones HTTP.
  - `ProfileService` encargado de reglas de negocio específicas de perfiles (por ejemplo, actualización de hándicap, preferencias del jugador o estadísticas agregadas).
  - Puede depender de `UsersService` cuando deba sincronizar atributos básicos del usuario.
- **RoundsModule** (planeado para siguientes mejoras): alojará toda la lógica de rondas que actualmente vive en el frontend.

## Planificación por Iteraciones
1. **Iteración 1 – Preparación** ✅ _Completada_
   - Introducir un `CoreModule` que provea servicios compartidos y registrar allí proveedores reutilizables.
   - Revisar dependencias actuales para identificar acoplamientos implícitos.
2. **Iteración 2 – Refactor de Perfiles** ✅ _Completada_
   - Crear `ProfileService` y mover la lógica de negocio desde `profile.controller.ts`.
   - Actualizar pruebas o añadir nuevas que validen el servicio de forma aislada.
3. **Iteración 3 – Aislar Usuarios y Autenticación** ✅ _Completada_
   - Reorganizar `users.service` moviendo la persistencia a un `UsersRepository` dedicado y exponiendo una vista pública segura.
   - Añadir `UsersController` para servir datos sanitizados y mantener a `AuthModule` consumiendo únicamente `UsersService`.
4. **Iteración 4 – Endpoints de Rondas**
   - Diseñar `RoundsModule` con su servicio y controlador para centralizar la gestión de rondas.
   - Coordinar la futura migración de datos indicada en el punto 2 del documento.
5. **Iteración 5 – Limpieza y Documentación**
   - Eliminar código muerto, actualizar `docs/IMPROVEMENTS.md` con el estado de la refactorización y documentar contratos públicos.

## Lógica Detrás de la Estructura
- NestJS favorece módulos autocontenidos; esta organización aprovecha esa convención para mantener dependencias explícitas y sencillas.
- La jerarquía propuesta permite incorporar nuevas funcionalidades (p. ej., análisis de rondas) agregando módulos sin tocar los existentes.
- Separar servicios y controladores reduce el riesgo de mezclar lógica HTTP con reglas de negocio, siguiendo el principio de responsabilidad única.

## Comentarios Clave
- Cada módulo debe exponer solo lo necesario mediante `exports` en su archivo `module.ts` para evitar fugas de dependencias.
- Priorizar inyección de dependencias sobre instanciación manual mantiene el código alineado con las buenas prácticas de NestJS.
- Documentar contratos y dependencias en los archivos `README` o en comentarios de servicio ayuda a nuevos desarrolladores a entender rápidamente las interacciones.
