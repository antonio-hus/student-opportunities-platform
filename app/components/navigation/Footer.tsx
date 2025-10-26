// components/layout/PublicFooter.tsx
'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { useTranslations } from 'next-intl'
import Link from 'next/link'


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function Footer() {
    const t = useTranslations('pages.navigation.footer')
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-surface py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Platform Name & Copyright */}
                    <p className="text-sm text-text-secondary">
                        © {currentYear} {t('platformName')}. {t('allRightsReserved')}
                    </p>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link
                            href="/legal/privacy"
                            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                            {t('privacy')}
                        </Link>
                        <Link
                            href="/legal/terms"
                            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                            {t('terms')}
                        </Link>
                        <Link
                            href="/legal/contact"
                            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                            {t('contact')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
