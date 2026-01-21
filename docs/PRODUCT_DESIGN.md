# 🎨 Documento de Diseño de Producto: Fortnite Stats Pro

## 1. Visión del Producto
Transformar una herramienta de estadísticas en una **experiencia compañera** para el jugador. La interfaz debe sentirse como una extensión del juego: oscura, vibrante, rápida y precisa.

## 2. Identidad Visual "Gamer Premium"
### Tipografía
- **Títulos (Headings):** `Orbitron` (Google Fonts). Evoca tecnología, sci-fi y el HUD de Fortnite.
- **Cuerpo (Body):** `Inter`. Legibilidad máxima para datos densos.

### Paleta de Colores
- **Canvas:** `#0f1014` (Negro Profundo, reduce fatiga visual).
- **Surface:** `#1a1c24` (Gris Azulado Oscuro, para tarjetas).
- **Accent Primary:** `#bf5af2` (Violeta Mítico - Fortnite Epic/Legendary).
- **Accent Secondary:** `#32d74b` (Verde Alien - Fortnite Uncommon/Heal).
- **Utility:** `#0a84ff` (Azul Escudo).

### UI Kit
- **Bordes:** Finos (`1px`), con colores semitransparentes (`border-white/10`).
- **Sombras:** "Glow" en lugar de shadow tradicional. `box-shadow: 0 0 20px rgba(191, 90, 242, 0.2)`.
- **Botones:** Fondos con gradientes sutiles y hover effects de escala.

---

## 3. Estrategia iOS: "Sin App Store"
Para evitar el complejo y costoso proceso de la App Store, utilizamos **Scriptable**.

### ¿Cómo funciona para el usuario?
1.  **Descarga:** El usuario baja la app gratuita "Scriptable" del App Store.
2.  **Instalación:** Copia nuestro código JavaScript (que alojaremos en un Gist o en la web) y lo pega en Scriptable.
3.  **Configuración:** Al añadir el widget a su pantalla de inicio, usa la opción "Parameter" para poner su usuario de Epic (ej. "Ninja").
4.  **Resultado:** Un widget nativo, que se actualiza solo, sin que nosotros paguemos $99/año a Apple.

### Rediseño del Widget
El widget actual es funcional pero plano. El nuevo diseño (v2) incluirá:
- **Fondo:** Gradiente lineal oscuro (simulando la app).
- **Tipografía:** SF Pro Rounded (Nativa de iOS, amigable y gamer).
- **Layout:**
    - Izquierda: Avatar grande (letra inicial o imagen si la API lo permite) + Nivel.
    - Derecha: Grid compacto de K/D y Wins.
    - Footer: Barra de progreso visual (Win Rate).

---

## 4. Plan de Ejecución Inmediata
1.  **Web:** Aplicar fuentes `Orbitron`/`Inter` y corregir Título.
2.  **iOS:** Reescribir `fortnite_widget.js` con el diseño v2.
3.  **Docs:** Generar este documento para referencia futura.
