# Wiki Interna: Fortnite Stats App

## 1. Arquitectura
*(Sección existente...)*

## 2. Diccionario de Datos
*(Sección existente...)*

## 3. Componentes
*(Sección existente...)*

## 4. Modelo de Cálculo: Skill Radar (Borrador)
Este modelo define cómo puntuamos a los jugadores en el gráfico pentagonal (0-100).

### Ejes Propuestos
1.  **Combate (K/D):**
    - Fórmula: `min((kd / 5.0) * 100, 100)`
    - *Lógica:* 5.0 K/D se considera nivel "Dios" (100%).
2.  **Supervivencia (Top placements):**
    - Fórmula: Basada en % de Top 10 y Top 25.
3.  **Victoria (Win Rate):**
    - Fórmula: `min((winRate / 20.0) * 100, 100)`
    - *Lógica:* 20% Win Rate es excepcional.
4.  **Experiencia (Partidas/Nivel):**
    - Basado en `minutesPlayed` y `battlePass.level`.
5.  **Actividad (Reciente):**
    - *Pendiente de implementar con historial.*

*(Este modelo se refinará conforme ajustemos los algoritmos).*
