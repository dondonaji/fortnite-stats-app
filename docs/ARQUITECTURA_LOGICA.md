# Arquitectura Lógica del Sistema (APP LOGIC)

## 1. Visión Técnica Global
Fortnite Stats Pro (FSP) es una aplicación web progresiva (PWA) diseñada para ofrecer métricas de alto nivel a jugadores competitivos. A diferencia de un tracker convencional, FSP procesa datos crudos para ofrecer "Insights" de comportamiento.

### Stack Tecnológico
- **Frontend:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS + Shadcn/ui (Diseño Modular).
- **Animación:** Framer Motion (Transiciones de estado).
- **Data Fetching:** SWR (Stale-While-Revalidate) para datos en tiempo real con caché inteligente.
- **Persistencia:** LocalStorage para recordar al último usuario buscado (Experiencia "App Nativa").

## 2. Flujo de Datos (Data Pipeline)

### A. Entrada (Input)
1.  Usuario introduce `Epic ID`.
2.  El sistema normaliza el input (trim, lowercase).
3.  Se consulta `/api/stats?name={id}`.

### B. Procesamiento (Backend Proxy)
El endpoint interno `/api/stats` actúa como middleware seguro:
1.  **Validación:** Verifica que la petición venga del frontend autorizado.
2.  **External Request:** Llama a `fortnite-api.com` usando la `FORTNITE_API_KEY` (Server-side, oculta al cliente).
3.  **Transformación:**
    *   Si la API devuelve error 404/403 (Privado), se maneja el error.
    *   Si es éxito (200), se pasa el JSON crudo al frontend.

### C. Visualización (Client Component)
El frontend (`page.tsx`) recibe el JSON y lo descompone en:
*   **Identidad:** Avatar, Nivel, Nombre.
*   **Core Stats:** K/D, Wins, WinRate.
*   **Derived Metrics (Cálculos en Cliente):**
    *   *Time Played:* Conversión de minutos a `Días + Horas`.
    *   *Radar:* Normalización de stats contra benchmarks competitivos (ver [METRICAS_JUGADOR.md](./METRICAS_JUGADOR.md)).

## 3. Estados de la Interfaz
La app opera en una máquina de estados finita simple:
1.  **Idle (Hero):** Esperando input. Logo grande, input central.
2.  **Loading:** Spinner de carga, mensajes de "Sincronizando...".
3.  **Dashboard (Active):** Visualización de datos (Bento Grid).
4.  **Error:** Mensaje amigable si el usuario no existe.

## 4. Agentes y Mantenibilidad
El código está estructurado para ser mantenido por agentes IA especializados:
*   `Architect`: Mantiene la estructura de carpetas y `layout.tsx`.
*   `Designer`: Controla `globals.css` y `components/ui`.
*   `Product Owner`: Define features en `docs/`.
