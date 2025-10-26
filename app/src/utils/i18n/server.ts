/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { getCurrentLocale } from './locale'
import { loadMessagesSync, getTranslation } from './messages'
import type { Locale, TranslationFn } from './types'


/////////////////////////////
///   SERVER-SIDE UTILS   ///
/////////////////////////////
// Gets translation function for current user's locale
export async function getTranslations() {
    const locale = await getCurrentLocale()
    const messages = loadMessagesSync(locale)

    const t: TranslationFn = (key, params) => getTranslation(messages, key, params)
    return { t, locale }
}

// Gets translation function for specific locale
export function getTranslationsFor(locale: Locale) {
    const messages = loadMessagesSync(locale)
    return (key: string, params?: Record<string, string | number>) => getTranslation(messages, key, params)
}
