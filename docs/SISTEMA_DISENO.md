# Sistema de Diseño y Arte (FSP LUXURY)

## 1. Filosofía Estética: "Modern Luxury"
El objetivo es alejar el diseño del estereotipo "Gamer Neon 80s" y acercarlo a una estética de "Fintech de Alto Rendimiento" o "Dashboard Deportivo Premium".
*   **Keywords:** Sobriedad, Profundidad, Precisión, Eteridad.

## 2. Fundamentos Visuales

### Color (Paleta "Deep Dark")
No usamos negro puro (`#000`), sino tonos profundos para dar riqueza.
| Token | Valor Hex | Uso |
| :--- | :--- | :--- |
| `Background` | `#050505` | Fondo principal (casi negro). |
| `Card Base` | `rgba(20, 20, 20, 0.4)` | Base de tarjetas (Glass). |
| `Panel Base` | `rgba(10, 10, 10, 0.6)` | Paneles estructurales. |
| `Text Primary` | `#FFFFFF` | Títulos y datos clave. |
| `Text Muted` | `rgba(255, 255, 255, 0.4)` | Etiquetas y metadatos. |
| `Accent` | `#bf5af2` (Purple) | Solo para detalles muy específicos de identidad. |

### Tipografía (Dynamic Sans)
Usamos **Inter** (o Geist) aprovechando sus "Variable Weights".
*   **H1 (Logo):** `font-black`, `tracking-tighter`.
*   **Números (KPIs):** `font-light` en reposo -> `font-medium` en hover. Esto crea una sensación orgánica de "vida".
*   **Etiquetas:** `uppercase`, `tracking-widest` (espaciado generoso) para elegancia.

## 3. Componentes UX (Micro-Interacciones)

### Bento Grid
El dashboard no es una lista, es un **Grid Asimétrico**.
*   **Mobiliario:** Elementos grandes (Avatar) conviven con bloques compactos (Stats).
*   **Responsividad:** En móvil no se encogen simplemente; se re-apilan manteniendo su jerarquía de "aire".

### Efectos de Cristal ("Frosted Glass")
No usamos bordes sólidos gruesos. Usamos "borders" de 1px con `opacity-5` o `10`.
*   La separación se logra por contraste de "Blur" (`backdrop-filter: blur(20px)`), no por líneas.

## 4. Guía de Usuario (Navegación)
1.  **Home (The Gate):** Minimalista. Solo el input importa. Transmite "Exclusividad".
2.  **Transition:** Al buscar, el input no desaparece, *se transforma* (morph) hacia el header.
3.  **Dashboard (The Cockpit):** Toda la información de un vistazo. Sin scroll innecesario en escritorio.
