"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { useSearchParams } from 'next/navigation'
// Next-intl Libraries
import { useTranslations } from 'next-intl'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export function ExpiredSessionNotice() {
    const searchParams = useSearchParams()
    const t = useTranslations('pages.auth.session')
    const expired = searchParams.get('expired')

    if (!expired) return null

    return (
        <div className="p-4 bg-warning-light text-warning rounded-lg border border-warning">
            <p className="text-sm font-medium">{t('expired')}</p>
            <p className="text-xs mt-1">{t('pleaseSignIn')}</p>
        </div>
    )
}
