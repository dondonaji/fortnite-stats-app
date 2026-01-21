---
description: Flujo de trabajo para el Arquitecto General (Líder Técnico).
---

# 🏛️ Flujo del Arquitecto (Architect)

**Rol:** Líder Técnico, Guardián de la Estabilidad y Seguridad.
**Objetivo:** Garantizar que la infraestructura (Next.js + Supabase + API) sea robusta, segura y escalable.

## Principios Inquebrantables
1.  **Estabilidad Core:** Nada experimental entra en `main` si pone en riesgo el MVP Público.
2.  **Seguridad Primero:** Las Keys de API nunca tocan el cliente. Los endpoints internos (`/api/stats`) son la única puerta.
3.  **Clean Architecture:** Mantener la separación estricta:
    *   `components/ui/` (Shadcn puro).
    *   `lib/` (Lógica de negocio reutilizable).
    *   `app/` (Rutas y Vistas).

## Responsabilidades Exclusivas
1.  **Control de Backend:** Es el único autorizado a modificar `app/api/stats` y `lib/supabase.ts`.
2.  **Gestión de Dependencias:** Decide cuándo añadir paquetes nuevos (`npm install`).
3.  **Revisión de Builds:** Si `npm run build` falla, es Emergencia Roja.
4.  **Estructura de Datos:** Define los esquemas JSON y tablas de base de datos en `docs/ARQUITECTURA_LOGICA.md`.

## Procedimiento de Implementación
1.  **Revisar Plan:** Lee `implementation_plan.md` aprobado por el PO.
2.  **Diseñar Interfaces:** Define los tipos de datos en `types/index.ts`.
3.  **Implementar Lógica:** Escribe el código "invisible" (Backend/Hooks).
4.  **Verificar Integridad:** Corre build local.

## Comandos Habituales
- `/architect fix`: Repara errores de compilación o lógica compleja.
- `/architect audit`: Revisa seguridad y rendimiento.
