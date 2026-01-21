# Métricas de Jugador y Lógica de Juego

Este documento define las fórmulas matemáticas y la lógica detrás de los "Insights" que muestra Fortnite Stats Pro. No solo mostramos datos, los interpretamos.

---

## 1. Nivel 1: Métricas Nucleares (Raw Data)
Datos extraídos directamente de la API sin alteración mayor.
*   **Wins:** Victorias totales en modo seleccionado.
*   **Matches:** Partidas jugadas.
*   **Kills:** Enemigos eliminados.

---

## 2. Nivel 2: Métricas Derivadas (Calculated)
Aquí es donde FSP aporta valor agregado.

### A. K/D Ratio (Kill/Death) Real
*   *Fórmula:* `Kills / (Matches - Wins)`
*   *Lógica:* Si ganas una partida, no mueres. Muchas apps calculan `Kills / Matches`, lo cual penaliza a los ganadores. FSP usa la fórmula competitiva correcta.

### B. Life Expectancy (Tiempo de Vida)
*   *Fórmula:* `MinutesPlayed / Matches`
*   *Unidad:* Minutos/Partida.
*   *Interpretación:*
    *   `< 5 min`: **Hot Dropper** (Cae en zonas calientes, muere rápido).
    *   `10-15 min`: **Mid-Game Player** (Juega rotaciones).
    *   `> 20 min`: **End-Game Expert** (Suele llegar a los círculos finales).

### C. Win Efficiency (Eficiencia de Victoria)
*   *Fórmula:* `Wins / Matches * 100` (%)

---

## 3. Modelo del Radar de Habilidad ("Skill Polygon")
El radar de 5 ejes normaliza al jugador contra un "Estándar Pro" (Benchmark).

### Ejes y Benchmarks (Valor 100%)
Para obtener un 100 en un eje, el jugador debe igualar o superar estos valores:

1.  **COMBATE (K/D):**
    *   Benchmark: **5.0 K/D**
    *   *Cálculo:* `min((PlayerKD / 5.0) * 100, 100)`
2.  **VICTORIA (Win%):**
    *   Benchmark: **20% WR**
    *   *Cálculo:* `min((PlayerWinRate / 20.0) * 100, 100)`
3.  **AGRESIVIDAD (Kills/Match):**
    *   Benchmark: **6.0 KPM**
    *   *Cálculo:* `min((KillsPerMatch / 6.0) * 100, 100)`
4.  **CONSISTENCIA (Top 10%):**
    *   Benchmark: **25% de partidas en Top 10**
    *   *Cálculo:* `min(((Top10 / Matches) / 0.25) * 100, 100)`
5.  **EFICIENCIA (Score/Min):**
    *   Benchmark: **25 Score/Min** (XP gain speed)
    *   *Cálculo:* `min((ScorePerMin / 25.0) * 100, 100)`

---

## 4. Curva de Supervivencia (Survival Funnel)
Esta gráfica muestra en qué fase de la partida suele ser eliminado el jugador.
*   **Puntos de Datos:** `Matches` -> `Top 25` -> `Top 12` -> `Top 6` -> `Top 3` -> `Wins`.
*   **Análisis de Fuga:** Si la curva cae drásticamente entre `Top 25` y `Top 10`, el jugador sobrevive al inicio pero falla en el "Mid-game".
