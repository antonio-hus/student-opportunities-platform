/////////////////////////////
///    EXPORTS SECTION    ///
/////////////////////////////
// Supported locales
export const LOCALES = ['en', 'ro'] as const
export type Locale = (typeof LOCALES)[number]

// Default locale
export const DEFAULT_LOCALE: Locale = 'en'

// Cookie configuration
export const LOCALE_COOKIE = {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
} as const

// Type inference from message files
export type Messages = typeof import('@/resources/messages/en').default

// Translation function
export type TranslationFn = (key: string, params?: Record<string, string | number>) => string
