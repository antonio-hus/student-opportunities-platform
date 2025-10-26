/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
// Third-party Libraries
import { Mail, Phone, MapPin } from 'lucide-react'


/////////////////////////////
///   METADATA SECTION    ///
/////////////////////////////
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pages.legal.contact')

    return {
        title: t('title'),
    }
}


/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default function ContactPage() {
    const t = useTranslations('pages.legal.contact')

    return (
        <div>
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
                    {t('title')}
                </h1>
                <p className="mt-4 text-text-secondary">
                    {t('description')}
                </p>
            </div>

            {/* Contact Information */}
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-surface-elevated">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="mb-1 font-semibold text-text-primary">{t('emailLabel')}</h3>
                        <a
                            href={`mailto:${t('email')}`}
                            className="text-text-secondary transition-colors hover:text-primary"
                        >
                            {t('email')}
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-surface-elevated">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="mb-1 font-semibold text-text-primary">{t('phoneLabel')}</h3>
                        <a
                            href={`tel:${t('phone')}`}
                            className="text-text-secondary transition-colors hover:text-primary"
                        >
                            {t('phone')}
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-surface-elevated">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="mb-1 font-semibold text-text-primary">{t('addressLabel')}</h3>
                        <p className="text-text-secondary">
                            {t('address')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
