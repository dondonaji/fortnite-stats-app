# Estructura Visual del Proyecto

Este documento define los contenedores visuales y la jerarquía de la interfaz para garantizar consistencia y evitar problemas de diseño (como el estiramiento en escritorio).

## 1. Pantalla de Inicio (Home)
Estado: `!isDashboard`

| Contenedor | Descripción | Comportamiento Desktop |
| :--- | :--- | :--- |
| **Wrapper Principal** | Contenedor centrado vertical y horizontalmente. | `max-w-4xl`, centrado. |
| **Logo** | Branding principal "FORTNITE STATS PRO". | Texto grande, sin superposiciones. |
| **Buscador** | Barra de entrada de texto + Botón de acción. | Ancho fijo controlado, no pantalla completa. |

## 2. Dashboard (Tablero de Datos)
Estado: `isDashboard`

El Dashboard vive dentro de un contenedor principal con `max-w-7xl` (Sangrado) para evitar que se desparrame en pantallas ultra-anchas.

### Estructura de Grid (12 Columnas)

1.  **Barra Superior (Header)**
    *   Ubicación: Fila superior, ancho completo.
    *   Contenido: Logo pequeño (Izquierda), Botón Salir (Derecha).

2.  **Tarjeta de Jugador (Player Card)**
    *   Ubicación: Columna Izquierda (Desktop: 3-4 cols).
    *   Contenido: Avatar, Nombre (Grande), Nivel, Tiempos.
    *   Estilo: Panel vertical alto.

3.  **Stats Principales (KPIs)**
    *   Ubicación: Columna Derecha Superior (Desktop: 8-9 cols).
    *   Contenido: 4 Tarjetas (Victorias, K/D, Win%, Kills).
    *   Comportamiento: En móvil 2x2, en escritorio 4x1 (Fila horizontal).

4.  **Gráficos (Visuals)**
    *   Ubicación: Debajo de KPIs.
    *   **Pentágono (Radar)**: Habilidades relativas.
    *   **Hilo de Supervivencia**: Gráfico de lineal.
    *   **Históricos**: Gráfico de barras/progreso.

## Reglas de "Sangrado" (Constrain)
Para evitar el efecto "Agonía de Estiramiento":
*   **Móvil**: `w-full`, `p-4` (Ocupa todo).
*   **Tablet**: `max-w-3xl`, centrado.
*   **Escritorio**: `max-w-[1400px]`, `mx-auto` (Márgenes laterales automáticos).
*   **Ultra-Wide**: El contenido no crece más allá de 1400px.
