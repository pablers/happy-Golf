# Características Principales de la Aplicación

Este documento detalla las funcionalidades clave de la aplicación Golf Master.

## 1. Metrónomo de Swing

Herramienta de entrenamiento diseñada para perfeccionar el ritmo y la consistencia del swing.

- **Selección por Tipo de Palo**: Permite elegir entre Driver, Hierro Largo, Hierro Medio y Wedge, cada uno con un rango de BPM (Beats Per Minute) preconfigurado y recomendado.
- **Slider de Precisión**: Un control deslizante permite ajustar el tempo con exactitud dentro del rango de cada palo.
- **Guía de Rango Óptimo**: El slider incluye una guía visual que resalta la zona de tempo óptima para el palo seleccionado.
- **Sonido Musical**: Utiliza un sonido de xilófono sintetizado con la Web Audio API, con tonos ascendentes para marcar el patrón rítmico, resultando más agradable que un simple "beep".
- **Descarga de Audio**: Permite generar y descargar un archivo de audio `.wav` con el ritmo seleccionado para practicar sin conexión.

## 2. Tarjeta de Puntuación Inteligente

Una tarjeta digital completa que va más allá del simple registro de golpes.

- **Registro por Hoyo**: Permite introducir golpes y putts para 9 o 18 hoyos.
- **Cálculo Neto Automático**: Calcula automáticamente la puntuación neta por hoyo y el total de la ronda, teniendo en cuenta el Hándicap (HCP) del jugador y el Stroke Index (SI) de cada hoyo.
- **Notas por Hoyo**:
  - **Entrada Manual**: Cada hoyo tiene una sección expandible para escribir notas.
  - **Transcripción por Voz**: Permite subir un archivo de audio que es transcrito a texto usando la API de Google Gemini y se añade como comentario.
- **Guardado Automático**: Todos los datos de la ronda (puntuaciones, comentarios, respuestas) se guardan automáticamente en el almacenamiento local del navegador, permitiendo continuar una partida interrumpida.

## 3. Cuestionario Dinámico (El Corazón de la App)

Un sistema inteligente diseñado para recopilar información contextual sobre la ronda con la mínima interrupción.

- **Preguntas Iniciales**: Antes de empezar, la aplicación pregunta sobre el tiempo de práctica, el clima y el viento iniciales.
- **Detección de Patrones**: Un "árbol de decisión" analiza el rendimiento del jugador en tiempo real para detectar patrones:
  - **Buenos**: Resultados de Par o mejor.
  - **Malos / Muy Malos**: Bogeys, Doble Bogeys o peor.
  - **3-Putts**: Tres o más putts en un green.
  - **Volatilidad**: Grandes cambios en la puntuación entre hoyos consecutivos.
- **Lanzamiento Condicional**: Basado en los patrones detectados, la app lanza preguntas específicas en momentos clave:
  - **Clima**: Pregunta de confirmación en los hoyos 7 y 15.
  - **Césped**: Tras una racha de buenos hoyos.
  - **Estado Físico**: Tras una racha de malos hoyos.
  - **Estado Mental**: Tras hoyos con alta volatilidad.
  - **Greens**: Tras varios 3-putts.
- **Cooldown y Prioridad**: Para no ser intrusivo, el sistema tiene un "cooldown" (periodo de descanso) después de cada pregunta y un orden de prioridad si se detectan múltiples patrones a la vez.
- **Panel de Revisión**: Al final de la ronda, un panel permite revisar y editar todas las respuestas, así como contestar preguntas obligatorias (Físico, Mental) que no se hayan lanzado durante el juego.

## 4. Análisis de Rondas Post-Partida

Una vez guardada, cada ronda se puede analizar en una vista dedicada con múltiples visualizaciones de datos.

- **Historial de Rondas**: Una pantalla principal muestra una lista de todas las partidas guardadas.
- **Panel de Análisis Detallado**:
  - **Resumen**: Métricas clave como golpes totales, putts, resultado neto y doble bogeys.
  - **Gráficos de Líneas**:
    - **Golpes por Hoyo**: Compara los golpes reales con el "par ajustado" por HCP.
    - **Putts por Hoyo**: Compara los putts reales con un objetivo estándar de 2 putts.
  - **Mapa de Calor**: Una matriz visual de 18 hoyos coloreada según el resultado neto, para identificar rápidamente hoyos buenos y malos.
  - **Tabla de Respuestas**: Un resumen de todas las respuestas dadas en el cuestionario dinámico.

## 5. Perfil de Jugador y Autenticación

Una sección dedicada a configurar la aplicación para una experiencia a medida, ahora respaldada por un backend seguro.

- **Registro e Inicio de Sesión**: Sistema de autenticación seguro basado en JWT (JSON Web Tokens).
- **Persistencia de Datos**: El perfil del jugador (Nombre, HCP, Objetivo, Campos Favoritos) se guarda de forma segura en la base de datos del servidor.
- **Integración**: Los datos del perfil se usan en toda la app: el HCP se aplica por defecto, el nombre aparece en los análisis y el campo favorito se preselecciona al iniciar una nueva ronda.
- **Cierre de Sesión**: Opción para cerrar la sesión de forma segura.