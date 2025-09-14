
import type { TrainingObjective } from '../types';

export const TRAINING_OBJECTIVES: TrainingObjective[] = [
    {
        id: 'putt_improvement',
        title: 'Mejorar el Putt',
        levels: {
            principiante: {
                description: 'El objetivo es construir una base sólida. Nos centraremos en la postura, el agarre y un movimiento pendular simple para asegurar un contacto consistente y mejorar la confianza en los putts cortos.',
                steps: [
                    {
                        title: 'Fundamentos: Postura y Grip',
                        details: 'Coloca un palo en el suelo apuntando al hoyo. Alinea la cara del putter y luego tus pies, caderas y hombros paralelos a esa línea. Agarra el putter con las palmas enfrentadas. Siente que tus brazos y hombros forman un triángulo.'
                    },
                    {
                        title: 'Ejercicio de la Puerta (Contacto Centrado)',
                        details: 'Coloca dos tees en el suelo, apenas más anchos que la cabeza de tu putter. Practica hacer el swing a través de la "puerta" sin tocar los tees. Esto te enseña a golpear la bola en el centro de la cara del putter.'
                    },
                    {
                        title: 'Un Metro de Confianza',
                        details: 'Desde 1 metro de distancia, intenta meter 10 putts seguidos. No avances hasta conseguirlo. La repetición en distancias cortas crea una memoria muscular fundamental y una gran confianza.'
                    }
                ],
                rationale: 'Para un principiante, la consistencia es clave. Eliminar los 3 putts desde corta distancia tiene el impacto más rápido en la puntuación. Estos ejercicios construyen una base técnica repetible antes de preocuparse por la lectura de caídas o distancias largas.'
            },
            intermedio: {
                description: 'El objetivo es pasar de "no hacer 3 putts" a "empezar a meterlos". Nos centraremos en el control de la distancia y en desarrollar un sistema para leer las caídas básicas.',
                steps: [
                    {
                        title: 'Escalera de Distancia',
                        details: 'Coloca tees a 3, 6, 9 y 12 metros. Tira 3 bolas a cada tee, intentando que pasen el tee pero no más de un metro. Esto desarrolla tu "sensación" para diferentes distancias de putt.'
                    },
                    {
                        title: 'Lectura de Caídas Simplificada',
                        details: 'En un putt con caída, camina hasta el punto medio y siente la pendiente en tus pies. Imagina por dónde tendría que salir la bola para que la pendiente la "lleve" al hoyo. Empieza apuntando un poco fuera del hoyo y observa el resultado.'
                    },
                    {
                        title: 'Ejercicio del Reloj (Presión)',
                        details: 'Coloca 4 bolas alrededor del hoyo a 1.5 metros, como si fueran las 12, 3, 6 y 9 de un reloj. Tienes que meter las 4 seguidas. Si fallas una, empiezas de nuevo. Simula la presión de tener que meter un putt importante.'
                    }
                ],
                rationale: 'Un jugador intermedio ya tiene una base. La mayor fuente de mejora es eliminar los 3 putts en greenes grandes. La escalera de distancia es el ejercicio más efectivo para ello. La introducción a la lectura de caídas y los ejercicios bajo presión preparan para el siguiente nivel.'
            },
            avanzado: {
                description: 'El objetivo es convertir el putt en un arma. Nos enfocaremos en el control total de la velocidad, la lectura de caídas complejas y el rendimiento bajo presión para convertir oportunidades de birdie.',
                steps: [
                    {
                        title: 'Control de Velocidad de Élite',
                        details: 'En un green grande, haz un putt largo de 15 metros. Luego, tira tu segundo putt intentando que toque la primera bola. Repite 5 veces. Este ejercicio de "toque" eleva tu control de la velocidad a un nivel superior.'
                    },
                    {
                        title: 'Ejercicio de Puntos de Caída',
                        details: 'En un putt largo con doble caída, identifica el "pico" de la primera caída y el de la segunda. Tu objetivo es hacer pasar la bola por encima de esos dos puntos específicos. Visualizar el putt en segmentos lo hace más manejable.'
                    },
                    {
                        title: 'Juego de "Consecutivos"',
                        details: 'Desde 2 metros, cuenta cuántos putts seguidos eres capaz de meter. Tu récord personal es el objetivo a batir cada día. Los profesionales de élite suelen tener récords de más de 100. Este es el test definitivo de consistencia y concentración.'
                    }
                ],
                rationale: 'A un nivel avanzado, los detalles marcan la diferencia. No se trata solo de evitar errores, sino de capitalizar oportunidades. El control de velocidad de élite te da más oportunidades de meter putts largos, la lectura segmentada te ayuda en greenes complejos y los juegos de presión simulan las condiciones de un torneo.'
            }
        }
    },
    {
        id: 'driver_distance',
        title: 'Aumentar Distancia con el Driver',
        levels: {
            principiante: {
                description: 'El objetivo principal no es la potencia bruta, sino el contacto sólido y el equilibrio. Un golpe centrado y en equilibrio irá más lejos y más recto que un swing descoordinado y rápido.',
                steps: [
                    {
                        title: 'Equilibrio al Finalizar',
                        details: 'Después de cada swing con el driver, mantén la postura final durante 3 segundos. Si te caes o pierdes el equilibrio, el swing fue demasiado forzado. Un buen swing es un swing equilibrado.'
                    },
                    {
                        title: 'Tee Bajo para un Contacto Sólido',
                        details: 'Coloca el tee más bajo de lo normal, de forma que solo media bola asome por encima del driver. Esto te obliga a golpear la bola con una trayectoria más nivelada o ascendente, en lugar de "hacia abajo", que es un error común que roba distancia.'
                    },
                    {
                        title: 'Swing Continuo y Rítmico',
                        details: 'Haz 5 swings de práctica seguidos, sin parar, como si estuvieras dibujando un círculo continuo. Siente el ritmo y la fluidez. Luego, golpea la bola intentando replicar esa misma sensación de movimiento constante, no un golpe brusco.'
                    }
                ],
                rationale: 'Para el principiante, la distancia se encuentra en la eficiencia, no en el esfuerzo. Aprender a mantener el equilibrio, hacer un contacto centrado y desarrollar un ritmo suave son los pilares que, una vez establecidos, permitirán añadir velocidad de forma segura y efectiva.'
            },
            intermedio: {
                description: 'El objetivo es añadir velocidad de forma controlada. Ya tienes una base, ahora vamos a optimizar la secuencia de tu cuerpo para generar más "efecto látigo" y aumentar la velocidad de la cabeza del palo.',
                steps: [
                    {
                        title: 'Ejercicio de los Pies Juntos',
                        details: 'Colócate con los pies juntos. Inicia el backswing y, justo cuando empieces el downswing, da un paso hacia el objetivo con tu pie izquierdo (para diestros). Esto enseña al cuerpo a iniciar el downswing desde el suelo hacia arriba, una fuente clave de potencia.'
                    },
                    {
                        title: 'Maximiza tu Giro',
                        details: 'En el punto más alto del backswing (top), concéntrate en que tu espalda apunte al objetivo. Siente la tensión en el torso. Un giro más completo crea un arco más amplio y, por lo tanto, más velocidad potencial.'
                    },
                    {
                        title: 'Swings de "Whoosh"',
                        details: 'Coge el palo al revés (por la cabeza) y haz 10 swings lo más rápido que puedas. Concéntrate en escuchar el "whoosh" del aire. Intenta que el sonido sea más fuerte y que ocurra justo después de donde estaría la bola. Esto entrena la velocidad pura.'
                    }
                ],
                rationale: 'La distancia a este nivel proviene de una mejor secuencia cinética. El ejercicio de los pies juntos mejora la transferencia de peso, el giro maximizado aumenta el "motor" de la rotación y el entrenamiento de velocidad enseña a tus músculos a moverse más rápido.'
            },
            avanzado: {
                description: 'El objetivo es exprimir cada metro posible y controlar la trayectoria. Nos centraremos en técnicas de sobre-velocidad (overspeed training), el uso de las fuerzas del suelo y la capacidad de mover la bola.',
                steps: [
                    {
                        title: 'Entrenamiento de Sobre-Velocidad (Overspeed)',
                        details: 'Utiliza varillas de entrenamiento de diferentes pesos (una más ligera y una más pesada que tu driver). Haz 5 swings con la ligera, 5 con la pesada y 5 con tu driver, siempre a máxima intención. Esto "recalibra" tu sistema nervioso para aceptar velocidades más altas.'
                    },
                    {
                        title: 'Ejercicio del Salto Vertical',
                        details: 'Desde la postura, haz un pequeño salto vertical y aterriza. Siente cómo usas el suelo para impulsarte. Ahora, en el downswing, intenta replicar esa sensación de "empujar" contra el suelo con tu pie adelantado para iniciar la rotación explosiva de la cadera.'
                    },
                    {
                        title: 'Optimización del Ángulo de Ataque',
                        details: 'Coloca una caja de bolas (o la funda del driver) unos 30 cm delante de la bola. Tu objetivo es golpear la bola y que la cabeza del palo pase por encima del obstáculo. Esto fomenta un ángulo de ataque ascendente, que es crucial para maximizar la distancia con el driver.'
                    }
                ],
                rationale: 'A nivel avanzado, la potencia es una ciencia. El entrenamiento de sobre-velocidad rompe las barreras de velocidad, el uso de las fuerzas del suelo (Ground Reaction Forces) es cómo los profesionales generan potencia de élite, y la optimización del ángulo de ataque asegura que esa velocidad se traduzca en distancia máxima y spin óptimo.'
            }
        }
    },
    {
        id: 'iron_accuracy',
        title: 'Precisión con los Hierros',
        levels: {
            principiante: {
                description: 'El objetivo es simple: hacer un contacto consistente. Antes de preocuparnos por la dirección, debemos asegurarnos de golpear primero la bola y luego el suelo, logrando que la bola vuele de manera predecible.',
                steps: [
                    {
                        title: 'Toalla Detrás de la Bola',
                        details: 'Coloca una toalla pequeña unos 15 cm detrás de la bola. Tu único objetivo es golpear la bola sin tocar la toalla. Esto te obliga a tener un ángulo de ataque descendente, el secreto para un contacto puro con los hierros.'
                    },
                    {
                        title: 'Posición de la Bola',
                        details: 'Para hierros cortos (8, 9, PW), la bola debe estar en el centro de tus pies. Para hierros medios (5, 6, 7), un poco más adelantada. Juega con esto hasta que encuentres el punto donde el contacto es más sólido.'
                    },
                    {
                        title: 'Swing a Media Velocidad',
                        details: 'Olvídate de la potencia. Coge un hierro 7 y haz 10 swings a un 50% de tu velocidad. Concéntrate únicamente en la calidad del sonido en el impacto. Un "thump" sólido es lo que buscas. La precisión nace de un buen contacto, no de la fuerza.'
                    }
                ],
                rationale: 'El error más común de un principiante es intentar "ayudar" a la bola a subir, lo que resulta en filazos o golpes pesados. Estos ejercicios se centran en entrenar el movimiento correcto: un golpe descendente que comprime la bola contra la cara del palo.'
            },
            intermedio: {
                description: 'Ahora que el contacto es más consistente, el objetivo es controlar la dirección y las distancias. Desarrollaremos un swing "de referencia" y aprenderemos a alinear el cuerpo correctamente.',
                steps: [
                    {
                        title: 'Ejercicio de las Varillas de Tren',
                        details: 'Coloca dos varillas de alineación en el suelo. Una apunta directamente al objetivo (la línea de la bola). La otra es paralela y marca la línea de tus pies. La mayoría de los errores de dirección vienen de una mala alineación inicial. ¡Esto lo corrige!'
                    },
                    {
                        title: 'Conoce Tus Distancias',
                        details: 'Ve al campo de prácticas con un medidor de distancia (o usa las marcas). Golpea 10 bolas con tu hierro 7. Descarta las 2 peores y las 2 mejores, y calcula la media de las 6 restantes. Esa es tu distancia "real". Repite con todos tus hierros.'
                    },
                    {
                        title: 'Ventana de 9 Golpes',
                        details: 'Elige un objetivo. Golpea 3 bolas intentando hacer un draw (curva a la izquierda), 3 intentando hacer un fade (curva a la derecha) y 3 rectas. No importa si lo consigues, el objetivo es sentir cómo cambiar la trayectoria del swing afecta al vuelo de la bola.'
                    }
                ],
                rationale: 'Un jugador intermedio necesita fiabilidad. Conocer tus distancias exactas te permite elegir el palo correcto. Una alineación perfecta elimina la principal variable de error. Y empezar a experimentar con el vuelo de la bola es el primer paso para tener un control total.'
            },
            avanzado: {
                description: 'El objetivo es el control total: ser capaz de atacar cualquier bandera. Trabajaremos en el control de la trayectoria (alto/bajo), el "shaping" de los golpes (draw/fade) a voluntad y la precisión en distancias intermedias.',
                steps: [
                    {
                        title: 'Control de Trayectoria',
                        details: 'Para un golpe bajo y penetrante, coloca la bola un poco más atrás en tu stance y finaliza el swing con las manos bajas. Para un golpe alto, adelanta la bola y finaliza con las manos altas. Practica golpear por debajo y por encima de una cuerda o rama.'
                    },
                    {
                        title: 'Maestría del "Shaping"',
                        details: 'Para un draw, alinea tus pies y cuerpo ligeramente a la derecha del objetivo, pero la cara del palo apuntando al objetivo. Para un fade, al revés. El swing sigue la línea del cuerpo. Esto permite "mover" la bola para atacar banderas escondidas.'
                    },
                    {
                        title: 'Reloj de Wedges',
                        details: 'Imagina que tus brazos son las manecillas de un reloj. Con un sand wedge, haz swings llevando los brazos solo hasta las 7:30, 9:00 y 10:30. Mide las distancias exactas que consigues con cada swing. Tener estas "marchas" te da un control milimétrico dentro de los 100 metros.'
                    }
                ],
                rationale: 'A nivel avanzado, no basta con golpear recto. La capacidad de controlar la altura, la curva y las distancias intermedias es lo que te permite dejar la bola cerca del hoyo en cualquier condición y posición de bandera, transformando golpes buenos en excelentes.'
            }
        }
    },
    {
        id: 'short_game_control',
        title: 'Control en el Juego Corto',
        levels: {
            principiante: {
                description: 'El objetivo es eliminar los errores graves (filazos, "pescados") alrededor del green. Nos centraremos en un único movimiento de "chip" simple y repetible que haga que la bola ruede hacia el hoyo.',
                steps: [
                    {
                        title: 'El Movimiento de Putt con un Hierro 8',
                        details: 'Desde el borde del green, coge un hierro 8. Agárralo más corto y haz el mismo movimiento que harías con el putter: un péndulo con los hombros, sin usar las muñecas. Observa cómo la bola salta un poco y luego rueda como un putt.'
                    },
                    {
                        title: 'Peso en el Pie Izquierdo',
                        details: 'En tu postura de chip, coloca el 70% de tu peso en el pie izquierdo (para diestros) y mantenlo ahí durante todo el swing. Esto asegura que golpees la bola de forma descendente, que es la clave para un contacto limpio.'
                    },
                    {
                        title: 'El Juego de la Toalla',
                        details: 'Coloca una toalla a un metro de ti, en la línea hacia el hoyo. Tu objetivo es hacer que la bola bote justo después de la toalla y ruede el resto del camino. Esto te enseña a elegir un punto de bote y confiar en que la bola ruede.'
                    }
                ],
                rationale: 'El juego corto para principiantes se trata de simplicidad y seguridad. El "chip-putt" es el golpe más fácil y efectivo. Mantener el peso adelante previene los peores errores. Y centrarse en el punto de bote simplifica la complejidad del golpe.'
            },
            intermedio: {
                description: 'El objetivo es añadir variedad a tu arsenal. Aprenderemos a usar diferentes palos para diferentes situaciones y a controlar la altura del golpe (pitch vs. chip).',
                steps: [
                    {
                        title: 'La Escalera de Palos',
                        details: 'Desde el mismo punto a 5 metros del green, golpea 5 bolas con un PW, 5 con un hierro 8 y 5 con un Sand Wedge. Usa el mismo movimiento de chip. Observa las diferencias: el PW vuela bajo y rueda mucho, el SW vuela alto y frena antes. Aprende a elegir el palo según cuánto green tienes para trabajar.'
                    },
                    {
                        title: 'Introducción al Pitch (Uso de Muñecas)',
                        details: 'Para golpes más largos (15-30 metros) que necesitan volar más, necesitas un "pitch". Es un mini-swing. Practica quebrar ligeramente las muñecas en el backswing y sentir que el cuerpo gira hacia el objetivo. Es un golpe de ritmo, no de fuerza.'
                    },
                    {
                        title: 'Salida de Bunker Básica',
                        details: 'Abre la cara de tu Sand Wedge. Dibuja una línea en la arena 5 cm detrás de la bola. Tu único objetivo es golpear esa línea con fuerza. Es el palo y la arena los que sacan la bola, no tú. ¡No le tengas miedo a la arena!'
                    }
                ],
                rationale: 'Un jugador intermedio necesita opciones. Saber qué palo usar en cada chip te da un control enorme. Diferenciar entre el chip (rueda) y el pitch (vuelo) es fundamental. Y dominar la salida de bunker básica te quita uno de los mayores miedos del golf.'
            },
            avanzado: {
                description: 'El objetivo es la maestría: controlar el spin, manejar lies complicados y tener la creatividad para salir de cualquier situación alrededor del green.',
                steps: [
                    {
                        title: 'Control de Spin: "Spinner" vs "Release"',
                        details: 'Para un golpe bajo que frena rápido ("spinner"), mantén la cara del palo abierta durante el impacto. Para un golpe que rueda más ("release"), permite que tus manos giren naturalmente después del impacto. Practica ambos desde el mismo sitio para sentir la diferencia.'
                    },
                    {
                        title: 'Dominio de Lies Complicados',
                        details: 'Practica desde el rough denso, en pendientes cuesta arriba y cuesta abajo. Cuesta arriba, usa un palo con menos loft. Cuesta abajo, más loft y abre la cara. Aprender a adaptarse al lie es una habilidad de jugador de élite.'
                    },
                    {
                        title: 'El Flop Shot (Golpe de Globo)',
                        details: 'Para cuando tienes que volar un obstáculo y frenar la bola rápido. Abre la cara del palo al máximo y haz un swing completo y rápido, confiando en que el "bounce" del palo se deslice por debajo de la bola. Es un golpe de alto riesgo, pero que salva situaciones imposibles.'
                    }
                ],
                rationale: 'A nivel avanzado, el juego corto es arte y física. Controlar el spin te permite atacar banderas pegadas al borde. Manejar lies difíciles te ahorra golpes en situaciones imperfectas. Y tener golpes especiales como el flop shot en tu arsenal te da la confianza para enfrentar cualquier desafío.'
            }
        }
    }
];