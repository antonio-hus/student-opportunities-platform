/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getRequestConfig } from 'next-intl/server'
// Next Libraries
import { cookies } from 'next/headers'

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
// Type for message structure (inferred from English messages)
export type Messages = typeof import('@/messages/en').default

/////////////////////////////
///   LOCALE CONSTANTS    ///
/////////////////////////////
// Supported locales
export const locales = ['en', 'ro'] as const
export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'en'

/////////////////////////////
///   HELPER FUNCTIONS    ///
/////////////////////////////
// Helper to traverse nested object by key path
function getNestedValue(obj: any, keyPath: string): string {
    const keys = keyPath.split('.')
    let value: any = obj

    for (const key of keys) {
        value = value?.[key]
    }

    return value || keyPath
}

// Dynamic message loader (async)
export async function getMessages(locale: string): Promise<Messages> {
    // Ensure locale is valid, fallback to default
    const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale

    try {
        return (await import(`@/messages/${validLocale}`)).default
    } catch (error) {
        console.error(`Failed to load messages for locale: ${validLocale}`)
        return (await import(`@/messages/${defaultLocale}`)).default
    }
}

// Synchronous message loader (for server-side)
export function getMessagesSync(locale: string): Messages {
    const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale

    try {
        return require(`@/messages/${validLocale}`).default
    } catch (error) {
        console.error(`Failed to load messages for locale: ${validLocale}`)
        return require(`@/messages/${defaultLocale}`).default
    }
}

// Get translation function for server actions (async with cookies)
export async function getServerTranslations() {
    const cookieStore = await cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale

    // Load messages synchronously (safe in server context)
    const messages = getMessagesSync(locale)

    return {
        t: (key: string) => getNestedValue(messages, key),
        locale
    }
}

// Get translation function for specific locale (sync, for emails)
export function getTranslationsForLocale(locale: string = defaultLocale) {
    // Load messages synchronously
    const messages = getMessagesSync(locale)

    return (key: string) => getNestedValue(messages, key)
}

/////////////////////////////
///  I18N CONFIGURATION   ///
/////////////////////////////
// Configure next-intl to use cookie-based locale detection
export default getRequestConfig(async () => {
    // Get locale from cookie (or use default)
    const cookieStore = await cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale

    return {
        locale,
        // Dynamically import messages for the selected locale
        messages: await getMessages(locale)
    }
})
