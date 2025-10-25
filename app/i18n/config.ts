/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getRequestConfig } from 'next-intl/server'
// Next Libraries
import { cookies } from 'next/headers'

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Supported languages
export const locales = ['en', 'ro'] as const

// Default fallback language
export const defaultLocale = 'en' as const

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
        messages: (await import(`../messages/${locale}`)).default
    }
})
