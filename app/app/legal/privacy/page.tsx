/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
// Project Libraries
import MarkdownContent from '@/components/utils/MarkdownContent'


/////////////////////////////
///   METADATA SECTION    ///
/////////////////////////////
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pages.legal.privacy')

    return {
        title: t('title'),
    }
}


/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default function PrivacyPage() {
    const t = useTranslations('pages.legal.privacy')

    return (
        <div>
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
                    {t('title')}
                </h1>
                <p className="mt-4 text-sm text-text-secondary">
                    {t('lastUpdated')}
                </p>
            </div>

            {/* Content */}
            <MarkdownContent content={t('body')} />
        </div>
    )
}
