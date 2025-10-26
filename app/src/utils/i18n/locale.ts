/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { cookies } from 'next/headers'
// Project Libraries
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from './types'


/////////////////////////////
///    LOCALES SECTION    ///
/////////////////////////////
// Validates if string is a supported locale
export function isValidLocale(locale: unknown): locale is Locale {
    return typeof locale === 'string' && LOCALES.includes(locale as Locale)
}

// Gets valid locale with fallback
export function getValidLocale(locale: unknown): Locale {
    return isValidLocale(locale) ? locale : DEFAULT_LOCALE
}

// Gets current locale from cookies
export async function getCurrentLocale(): Promise<Locale> {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get(LOCALE_COOKIE.name)
    return getValidLocale(localeCookie?.value)
}

// Sets locale cookie
export async function setLocale(locale: Locale): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(LOCALE_COOKIE.name, locale, {
        path: '/',
        maxAge: LOCALE_COOKIE.maxAge,
        sameSite: 'lax',
    })
}
