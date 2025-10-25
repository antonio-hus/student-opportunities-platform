/////////////////////////////
///    THEME COLORS       ///
/////////////////////////////
/**
 * SINGLE SOURCE OF TRUTH FOR ALL COLORS
 * Edit this file to change the entire app theme
 * - Automatically updates globals.css
 * - Automatically updates email templates
 * - Automatically updates Tailwind config
 */

export const themeColors = {
    light: {
        primary: '#14b8a6',
        primaryHover: '#0d9488',
        primaryLight: '#5eead4',
        primaryDark: '#0f766e',
        primaryForeground: '#ffffff',

        secondary: '#64748b',
        secondaryHover: '#475569',
        secondaryLight: '#94a3b8',
        secondaryDark: '#334155',
        secondaryForeground: '#ffffff',

        accent: '#f59e0b',
        accentHover: '#d97706',
        accentLight: '#fbbf24',
        accentDark: '#b45309',
        accentForeground: '#ffffff',

        success: '#10b981',
        successLight: '#d1fae5',
        successForeground: '#ffffff',

        error: '#ef4444',
        errorLight: '#fee2e2',
        errorForeground: '#ffffff',

        warning: '#f59e0b',
        warningLight: '#fef3c7',
        warningForeground: '#ffffff',

        info: '#3b82f6',
        infoLight: '#dbeafe',
        infoForeground: '#ffffff',

        background: '#ffffff',
        foreground: '#171717',
        surface: '#f9fafb',
        surfaceElevated: '#ffffff',

        textPrimary: '#0f172a',
        textSecondary: '#64748b',
        textTertiary: '#94a3b8',
        textDisabled: '#cbd5e1',

        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#14b8a6',

        muted: '#f1f5f9',
        mutedForeground: '#64748b',
    },

    dark: {
        primary: '#5eead4',
        primaryHover: '#2dd4bf',
        primaryLight: '#99f6e4',
        primaryDark: '#14b8a6',
        primaryForeground: '#0f172a',

        secondary: '#94a3b8',
        secondaryHover: '#cbd5e1',
        secondaryLight: '#cbd5e1',
        secondaryDark: '#64748b',
        secondaryForeground: '#0f172a',

        accent: '#fbbf24',
        accentHover: '#fcd34d',
        accentLight: '#fde68a',
        accentDark: '#f59e0b',
        accentForeground: '#0f172a',

        success: '#34d399',
        successLight: '#065f46',
        successForeground: '#0f172a',

        error: '#f87171',
        errorLight: '#7f1d1d',
        errorForeground: '#ffffff',

        warning: '#fbbf24',
        warningLight: '#78350f',
        warningForeground: '#0f172a',

        info: '#60a5fa',
        infoLight: '#1e3a8a',
        infoForeground: '#0f172a',

        background: '#0a0a0a',
        foreground: '#ededed',
        surface: '#1a1a1a',
        surfaceElevated: '#262626',

        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textTertiary: '#94a3b8',
        textDisabled: '#64748b',

        border: '#404040',
        input: '#404040',
        ring: '#5eead4',

        muted: '#262626',
        mutedForeground: '#a1a1aa',
    },
} as const

export function getThemeColors(mode: 'light' | 'dark' = 'light') {
    return themeColors[mode]
}
