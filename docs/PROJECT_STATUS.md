# Estado del Proyecto: Golf Master

## 1. Resumen del Estado Actual

**Golf Master** es una aplicación web full-stack diseñada para golfistas, combinando un metrónomo de swing y una tarjeta de puntuación inteligente.

### Logros Implementados:
- **Frontend**: SPA construida con React y Vite, estructurada con enrutamiento (`react-router-dom`) y gestión de estado mediante Contexts (`AuthContext`, `RoundsContext`). Incluye el metrónomo de swing, registro en tarjeta de puntuación, análisis visual de rondas post-partida y un cuestionario dinámico integrado con Gemini AI.
- **Backend**: API modular creada con NestJS (Auth, Users, Profile, Rounds). Cuenta con autenticación JWT robusta y arquitectura de controladores/servicios preparada para escala.
- **Datos**: Se han centralizado servicios y la persistencia está migrando de almacenamiento en memoria/`localStorage` a una base de datos relacional (PostgreSQL a través de Prisma ORM).

---

## 2. Planes de Implementación Actuales (En curso / Documentados)

Basado en la documentación técnica existente (`IMPROVEMENTS.md` y `backend-refactor-plan.md`), la hoja de ruta técnica se centra en:

1. **Centralización Definitiva en el Backend**: Migrar totalmente las rondas guardadas en el `localStorage` y CSV del frontend para que sean gestionadas por la API y guardadas en PostgreSQL. Esto evitará fragmentación y proveerá una única fuente de verdad.
2. **Optimización de la Experiencia de Desarrollo (DX)**: Configurar un proxy en Vite mediante `VITE_API_URL` para simplificar llamadas entre frontend y backend durante el desarrollo local, esquivando configuraciones complejas de CORS.
3. **Mejoras en Base de Datos**: Habilitar métricas para conexiones de Prisma, agregar índices compuestos en PostgreSQL para búsquedas eficientes (por usuario y fecha) y estabilizar la conexión hacia el proveedor de BD.

---

## 3. Plan de Despliegue: VPS Hetzner + Coolify (Híbrido)

Para desplegar la aplicación de forma eficiente y económica, alejándose de los altos costes o limitaciones de los servicios Cloud serverless puros, se plantea la siguiente estrategia para entornos tipo MVP:

- **Infraestructura Base**: Contratar un **VPS en Hetzner**. Esta opción proporciona un hardware dedicado potente a un precio muy accesible, permitiendo compartir el servidor con otros proyectos MVP.
- **Gestión con Coolify**: Se instalará **Coolify** (una alternativa Open Source a Vercel/Heroku) en el VPS. Esto permitirá:
  - **Despliegue Git-Push**: Conectar el repositorio de GitHub para que tanto el frontend (estático/Vite) como el backend (Node.js/Nest) se desplieguen automáticamente con cada commit en la rama principal.
  - **Bases de Datos Autogestionadas**: Desplegar la instancia de PostgreSQL directamente desde el panel de Coolify en el mismo servidor, reduciendo latencias de red y ahorrando costes externos.
  - **SSL y Dominios**: Generación automática de certificados Let's Encrypt y manejo del proxy inverso integrado.
  - **Eficiencia**: Monitorear los recursos para acomodar varios MVPs en una sola máquina sin colisiones.

---

## 4. Nuevas Funcionalidades: Entrenamiento y Entrada de Datos

La usabilidad en el campo de golf debe ser rápida y poco intrusiva. A continuación, se detallan nuevas propuestas para mejorar la entrada de datos durante el juego y agregar valor al entrenamiento:

### A. Facilidades para la Entrada de Datos en el Campo
1. **Asistente de Voz Estructurado (Voice-to-Data con IA)**: Evolucionar la transcripción actual de audio usando la IA. El jugador podrá decir *"Hoyo 4, par 4, hice 5 golpes con 2 putts. Mucho viento lateral"*, y la aplicación interpretará los comandos para rellenar los valores numéricos y notas automáticamente en la tarjeta de puntuación, sin necesidad de usar el teclado.
2. **Interfaz Rápida "One-Tap"**: Implementar un "Modo Campo" o "Zen Mode" con una interfaz de pantalla completa que muestre botones enormes para sumar o restar golpes y putts rápidamente. Optimizado para alto brillo y visualización al sol.
3. **PWA para Smartwatch (Wearables)**: Adaptar la aplicación como PWA para que funciones básicas de entrada de puntuación sean accesibles desde Apple Watch o relojes Wear OS, permitiendo al usuario registrar la puntuación con toques mínimos sin sacar el smartphone del bolsillo.

### B. Utilidades para Mejorar el Entrenamiento
1. **Generador de "Drills" (Ejercicios) por IA**: Basándose en las deficiencias detectadas (por ejemplo: alta volatilidad en los putts, resultados pobres en hoyos de par 5), el sistema de IA recomendará 2 o 3 ejercicios específicos o rutinas de práctica a realizar en el área de entrenamiento antes de la próxima ronda.
2. **Metrónomo Háptico**: Añadir soporte para la API de Vibración del navegador. El metrónomo no solo emitirá sonidos, sino que vibrará el teléfono para indicar el tempo del swing. Ideal para practicar en el campo sin molestar a otros jugadores o en entornos ruidosos.
3. **Registro Rápido de "Lie" y Palo**: Añadir botones visuales simples para seleccionar si un golpe fue desde *Calle*, *Rough* o *Bunker*, y el palo usado. Esto cruzará datos en el análisis final, mostrando qué área del juego o qué palo específico está perjudicando el handicap.
