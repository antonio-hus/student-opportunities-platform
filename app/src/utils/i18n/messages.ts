/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { DEFAULT_LOCALE, type Messages } from './types'
import { getValidLocale } from './locale'


/////////////////////////////
///    LOADERS SECTION    ///
/////////////////////////////
// Loads messages for locale (async)
export async function loadMessages(locale: unknown): Promise<Messages> {
    const validLocale = getValidLocale(locale)

    try {
        return (await import(`@/resources/messages/${validLocale}`)).default
    } catch (error) {
        console.error(`Failed to load messages for locale: ${validLocale}`, error)
        return (await import(`@/resources/messages/${DEFAULT_LOCALE}`)).default
    }
}

// Loads messages synchronously (for server context)
export function loadMessagesSync(locale: unknown): Messages {
    const validLocale = getValidLocale(locale)

    try {
        return require(`@/resources/messages/${validLocale}`).default
    } catch (error) {
        console.error(`Failed to load messages for locale: ${validLocale}`, error)
        return require(`@/resources/messages/${DEFAULT_LOCALE}`).default
    }
}

// Gets nested translation value by dot notation key
export function getTranslation(
    messages: Messages,
    key: string,
    params?: Record<string, string | number>
): string {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
        value = value?.[k]
        if (value === undefined) {
            console.warn(`Translation key not found: ${key}`)
            return key
        }
    }

    let translation = typeof value === 'string' ? value : key

    // Replace parameters
    if (params) {
        Object.entries(params).forEach(([param, val]) => {
            translation = translation.replace(`{${param}}`, String(val))
        })
    }

    return translation
}
