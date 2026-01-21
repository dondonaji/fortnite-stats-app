# 🛠️ Reporte de Optimización y Depuración

Este documento sugiere pasos para limpiar la estructura del proyecto y mejorar la base de código Next.js.

## 1. Limpieza de Estructura (Depuración)
Actualmente, la raíz `c:\Users\Don\fortnite-stats-app` mezcla dos proyectos:
1.  **Legacy (Python/Streamlit):** `app.py`, `main.py`, `views/`, `components/` (Python).
2.  **Modern (Next.js):** `fortnite-stats-web/`.

**Acción Recomendada:**
Crear una carpeta `_legacy_v1` y mover allí todo lo relacionado con Python. Dejar la raíz limpia solo con la carpeta del proyecto Web y la documentación.

## 2. Optimizaciones de Código (Next.js)

### A. Gestión de Estado y Caching
*   **Estado Actual:** Usamos `useEffect` + `fetch` nativo.
*   **Problema:** Si cambias de pestaña y vuelves, los datos no se refrescan automáticamente. Gestión manual de `loading` y `error`.
*   **Sugerencia:** Migrar a **SWR** (`npm i swr`).
    ```tsx
    const { data, error } = useSWR(`/api/stats?name=${user}`, fetcher)
    ```
    Esto maneja caché, revalidación en foco y evita "parpadeos".

### B. Skeleton Loaders (UI/UX)
*   **Estado Actual:** Un spinner "⏳ Conectando..." básico.
*   **Sugerencia:** Usar `react-loading-skeleton`.
*   **Efecto:** Muestra una estructura gris pulsante (Avatar, Barras) que comunica "ya casi está" y reduce la percepción de espera.

### C. Tipado Estricto (TypeScript)
*   **Estado Actual:** Algunos usos de `any` en `json.data`.
*   **Sugerencia:** Definir interfaces estrictas (`FortnitePlayer`, `FortniteStats`) compartidas entre Backend y Frontend para evitar errores de autocompletado.

## 3. SEO y Social (Viralidad)
*   **Open Graph:** Crear `app/api/og/route.tsx` usando `ImageResponse` de Next.js.
*   **Resultado:** Generar imágenes dinámicas (PNG) con el K/D del jugador para que aparezcan en Twitter/WhatsApp al compartir el link.
