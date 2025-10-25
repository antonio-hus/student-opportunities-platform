"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { useTranslations } from 'next-intl'

/////////////////////////////
///     PAGE COMPONENT    ///
/////////////////////////////
export default function HomePage() {
    // Get translations for home page
    const t = useTranslations('pages.home')

    return (
        <div>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
        </div>
    )
}
