# 🧠 Análisis de Inteligencia de Datos: Fortnite

**Propósito:** Este documento define cómo transformamos los datos crudos de la API en métricas de valor para el usuario.
**Referencia Técnica:** Ver [API_REFERENCE.json](./API_REFERENCE.json) para la estructura cruda completa.

---

## 📊 Nivel 1: Métricas Nucleares (Display Directo)
Estas son las estadísticas fundamentales que todo jugador busca inmediatamente.

| Métrica | Ruta API (`stats.all.overall`) | Formato Visual | Prioridad |
| :--- | :--- | :--- | :--- |
| **Victorias** | `.wins` | Número Grande (`500`) | 👑 Alta |
| **Ratio K/D** | `.kd` | Decimal 2 dígitos (`6.00`) | 👑 Alta |
| **Win Rate** | `.winRate` | Porcentaje (`16.6%`) | 👑 Alta |
| **Eliminaciones** | `.kills` | Entero (`15,000`) | Media |
| **Partidas** | `.matches` | Entero (`3,000`) | Media |
| **Tiempo Juego** | `.minutesPlayed` | Humano (`31D 6H`) | Baja (Detalle) |

---

## 🧪 Nivel 2: Algoritmos de Insights (Análisis Avanzado)
Cruzamos múltiples puntos de datos para generar métricas de comportamiento ("Psychographics").

### 1. Factor de Sangre Fría ("Clutch Factor")
Mide la capacidad del jugador para cerrar partidas bajo presión.
> **Fórmula:** `(Wins / Top10) * 100`

*   **Interpretación:**
    *   `> 40%`: **Asesino.** Si llega al final, gana.
    *   `20-40%`: **Sólido.** Buen competidor.
    *   `< 20%`: **Nervioso.** Suele fallar en el último círculo.

### 2. Estilo de Juego ("Playstyle Matrix")
Determina si el jugador es agresivo o estratega.
> **Eje X (Supervivencia):** `% Top 25`
> **Eje Y (Agresividad):** `Kills Por Partida`

| Resultado | Perfil | Descripción |
| :--- | :--- | :--- |
| Alto Kills / Bajo Top | **W-Keyer** | Busca peleas, ignora ganar. |
| Bajo Kills / Alto Top | **Camper** | Juega escondido/estratégico. |
| Alto Kills / Alto Top | **Pro/God** | Domina mecánica y macro-juego. |
| Bajo Kills / Bajo Top | **Casual** | Está aprendiendo. |

### 3. Índice de Supervivencia ("Life Expectancy")
Estima cuánto dura vivo en promedio.
> **Fórmula:** `minutesPlayed / matches`

*   Permite decirle al usuario: *"Sobrevives una media de 18 minutos por partida"*.

---

## 📈 Modelado Visual (Gráficas)

### Radar de Habilidad (Puntaje 0-100)
Normalizamos los datos contra un "Estándar Pro" para dibujar el pentágono.

1.  **Combate:** `min(KD / 5.0, 1) * 100`
2.  **Victoria:** `min(Win% / 20.0, 1) * 100`
3.  **Eficiencia:** `min(ScorePerMin / 25.0, 1) * 100`
4.  **Agresividad:** `min(KillsPerMatch / 6.0, 1) * 100`
5.  **Consistencia:** `min(Top10% / 25.0, 1) * 100`

### Curva de Supervivencia
Visualiza el "Embudo de la Muerte".
*   Datos: `Matches` -> `Top 25` -> `Top 10` -> `Top 5` -> `Win`.
*   Objetivo: Mostrar dónde suele ser eliminado el jugador.
