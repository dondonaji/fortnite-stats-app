// Theme constants for FN Stats Pro
// Centralized color palette and design tokens

export const theme = {
    colors: {
        // Primary accent
        primary: '#7c3aed',
        primaryDark: '#4c1d95',
        primaryGradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',

        // Status colors
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        info: '#3b82f6',

        // KPI colors
        kpi: {
            wins: '#facc15',
            matches: '#3b82f6',
            kd: '#ef4444',
            winRate: '#22c55e',
        },

        // Placement colors
        placement: {
            top25: '#3b82f6',
            top10: '#8b5cf6',
            top5: '#f97316',
            top3: '#eab308',
            wins: '#22c55e',
        },

        // UI colors
        background: '#09090b',
        cardBg: 'rgba(255,255,255,0.025)',
        cardBorder: 'rgba(255,255,255,0.06)',
        cardBorderHover: 'rgba(255,255,255,0.12)',

        // Text colors
        textPrimary: '#fafafa',
        textSecondary: '#d4d4d8',
        textMuted: '#71717a',
        textDim: '#52525b',
    },

    // Border radius (gaming aesthetic - less rounded)
    radius: {
        card: 10,
        inner: 6,
        badge: 4,
        button: 6,
    },

    // Spacing scale
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },

    // Typography
    fonts: {
        heading: {
            weight: 700,
            tracking: '-0.02em',
        },
        label: {
            weight: 500,
            tracking: '0.05em',
            transform: 'uppercase' as const,
            size: '10px',
        },
    },
} as const;

export type Theme = typeof theme;
