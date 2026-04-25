# Estado del Proyecto: Golf Master

## 1. Resumen del Estado Actual

**Golf Master** es una aplicacin web full-stack diseñada para golfistas, combinando un metrnomo de swing y una tarjeta de puntuacin inteligente.

### Logros Implementados:
- **Frontend**: SPA construida con React y Vite, estructurada con enrutamiento (`react-router-dom`) y gestin de estado mediante Contexts (`AuthContext`, `RoundsContext`). Incluye el metrnomo de swing, registro en tarjeta de puntuacin, anǭlisis visual de rondas post-partida y un cuestionario dinǭmico integrado con Gemini AI.
- **Backend**: API modular creada con NestJS (Auth, Users, Profile, Rounds). Cuenta con autenticacin JWT robusta y arquitectura de controladores/servicios preparada para escala.
- **Datos**: Se han centralizado servicios y la persistencia estǭ migrando de almacenamiento en memoria/`localStorage` a una base de datos relacional (PostgreSQL a travǸs de Prisma ORM).

---

## 2. Planes de Implementacin Actuales (En curso / Documentados)

Basado en la documentacin tǸcnica existente (`IMPROVEMENTS.md` y `backend-refactor-plan.md`), la hoja de ruta tǸcnica se centra en:

1. **Centralizacin Definitiva en el Backend**: Migrar totalmente las rondas guardadas en el `localStorage` y CSV del frontend para que sean gestionadas por la API y guardadas en PostgreSQL. Esto evitarǭ fragmentacin y proveerǭ una ǧnica fuente de verdad.
2. **Optimizacin de la Experiencia de Desarrollo (DX)**: Configurar un proxy en Vite mediante `VITE_API_URL` para simplificar llamadas entre frontend y backend durante el desarrollo local, esquivando configuraciones complejas de CORS.
3. **Mejoras en Base de Datos**: Habilitar mǸtricas para conexiones de Prisma, agregar ndices compuestos en PostgreSQL para bǧsquedas eficientes (por usuario y fecha) y estabilizar la conexin hacia el proveedor de BD.

---

## 3. Plan de Despliegue: VPS Hetzner + Coolify (Hbrido)

Para desplegar la aplicacin de forma eficiente y econmica, alejǭndose de los altos costes o limitaciones de los servicios Cloud serverless puros, se plantea la siguiente estrategia para entornos tipo MVP:

- **Infraestructura Base**: Contratar un **VPS en Hetzner**. Esta opcin proporciona un hardware dedicado potente a un precio muy accesible, permitiendo compartir el servidor con otros proyectos MVP.
- **Gestin con Coolify**: Se instalarǭ **Coolify** (una alternativa Open Source a Vercel/Heroku) en el VPS. Esto permitirǭ:
  - **Despliegue Git-Push**: Conectar el repositorio de GitHub para que tanto el frontend (estǭtico/Vite) como el backend (Node.js/Nest) se desplieguen automǭticamente con cada commit en la rama principal.
  - **Bases de Datos Autogestionadas**: Desplegar la instancia de PostgreSQL directamente desde el panel de Coolify en el mismo servidor, reduciendo latencias de red y ahorrando costes externos.
  - **SSL y Dominios**: Generacin automǭtica de certificados Let's Encrypt y manejo del proxy inverso integrado.
  - **Eficiencia**: Monitorear los recursos para acomodar varios MVPs en una sola mǭquina sin colisiones.

---

## 4. Nuevas Funcionalidades: Entrenamiento y Entrada de Datos

La usabilidad en el campo de golf debe ser rǭpida y poco intrusiva. A continuacin, se detallan nuevas propuestas para mejorar la entrada de datos durante el juego y agregar valor al entrenamiento:

### A. Facilidades para la Entrada de Datos en el Campo
1. **Asistente de Voz Estructurado (Voice-to-Data con IA)**: Evolucionar la transcripcin actual de audio usando la IA. El jugador podrǭ decir *"Hoyo 4, par 4, hice 5 golpes con 2 putts. Mucho viento lateral"*, y la aplicacin interpretarǭ los comandos para rellenar los valores numǸricos y notas automǭticamente en la tarjeta de puntuacin, sin necesidad de usar el teclado.
2. **Interfaz Rǭpida "One-Tap"**: Implementar un "Modo Campo" o "Zen Mode" con una interfaz de pantalla completa que muestre botones enormes para sumar o restar golpes y putts rǭpidamente. Optimizado para alto brillo y visualizacin al sol.
3. **PWA para Smartwatch (Wearables)**: Adaptar la aplicacin como PWA para que funciones bǭsicas de entrada de puntuacin sean accesibles desde Apple Watch o relojes Wear OS, permitiendo al usuario registrar la puntuacin con toques mnimos sin sacar el smartphone del bolsillo.

### B. Utilidades para Mejorar el Entrenamiento
1. **Generador de "Drills" (Ejercicios) por IA**: Basǭndose en las deficiencias detectadas (por ejemplo: alta volatilidad en los putts, resultados pobres en hoyos de par 5), el sistema de IA recomendarǭ 2 o 3 ejercicios especficos o rutinas de prǭctica a realizar en el ǭrea de entrenamiento antes de la prxima ronda.
2. **Metrnomo Hǭptico**: Aadir soporte para la API de Vibracin del navegador. El metrnomo no solo emitirǭ sonidos, sino que vibrarǭ el telǸfono para indicar el tempo del swing. Ideal para practicar en el campo sin molestar a otros jugadores o en entornos ruidosos.
3. **Registro Rǭpido de "Lie" y Palo**: Aadir botones visuales simples para seleccionar si un golpe fue desde *Calle*, *Rough* o *Bunker*, y el palo usado. Esto cruzarǭ datos en el anǭlisis final, mostrando quǸ ǭrea del juego o quǸ palo especfico estǭ perjudicando el handicap.
