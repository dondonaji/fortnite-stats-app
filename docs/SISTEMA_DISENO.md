# Sistema de Diseño - FN Stats Pro

## Tipografía
- **Font**: Geist (Google Fonts)
- **Títulos**: 700 weight, -0.02em tracking
- **Labels**: 500 weight, uppercase, 0.05em tracking, 9-10px

## Border Radius (Gaming Aesthetic)
| Elemento | Valor |
|----------|-------|
| Cards    | 10px  |
| Inputs/Buttons | 6px |
| Badges   | 4px   |

## Colores
- **Background**: #09090b (zinc-950)
- **Cards**: rgba(255,255,255,0.025)
- **Borders**: rgba(255,255,255,0.06)
- **Accent**: #7c3aed (purple-600)
- **Success**: #22c55e
- **Text Primary**: #d4d4d8
- **Text Muted**: #71717a

## Layout (Dashboard)
```
┌─────────────────────────────────────────────────────┐
│ HEADER: Logo ←→ [Search] [Buscar] [Versus]          │
├─────────────────────────────────────────────────────┤
│ PLAYER CARD: Avatar + Name + Stats                  │
├────────────┬────────────┬────────────┬──────────────┤
│    KPI 1   │    KPI 2   │    KPI 3   │    KPI 4     │
│   (1fr)    │   (1fr)    │   (1fr)    │    (1fr)     │
├────────────┴────┬───────┴────────────┴──────────────┤
│   Pentagrama    │     Análisis de Habilidades       │
│     (1fr)       │            (2fr)                  │
├─────────────────┴───────────────────┬───────────────┤
│     Análisis de Supervivencia       │  Posiciones   │
│              (2fr)                  │    (1fr)      │
├─────────────────────────────────────┴───────────────┤
│              Progreso Histórico (full)              │
├─────────────────────────────────────────────────────┤
│ FOOTER: FN Stats Pro [BETA] • Online • Visitas • Don│
└─────────────────────────────────────────────────────┘
```

## Layout (Home)
- Centrado vertical y horizontal
- Search box: 360px max-width
- Info de estado en esquina inferior derecha (Online + BETA)
- Sin footer global (solo en Dashboard)
