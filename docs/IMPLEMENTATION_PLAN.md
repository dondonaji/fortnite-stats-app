# Plan de Implementación: Fase 5 (Limpieza y Producción)

## 1. Arquitectura & SEO (Refactor)
- [ ] **Nueva Ruta Dinámica (`app/player/[username]/page.tsx`):**
    - Mover la lógica del Dashboard aquí.
    - Implementar `generateMetadata` para títulos dinámicos (e.g., "Stats de Ninja").
    - Permitir compartir URL directa.
- [ ] **Limpieza de Home (`app/page.tsx`):**
    - Mantener solo el buscador (Hero).
    - Redirigir a `/player/[username]` al buscar.

## 2. UI/UX Premium: Skeleton Loaders
- [ ] **Componente `components/ui/skeleton.tsx`:**
    - Crear componente nativo (Tailwind + `animate-pulse`) para reemplazar la librería externa y tener control total del diseño.
    - Diseño "Glass" compatible con el tema oscuro.
- [ ] **Skeleton del Dashboard:**
    - Replicar la estructura exacta del Dashboard (Avatar, KPIs, Gráficos) en estado de carga.

## 3. Limpieza (Cleanup)
- [x] Mover `setup_dev.bat` a `_legacy/`.
- [ ] Limpiar código muerto en `app/page.tsx` tras el refactor.
