/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import VerifyEmailForm from './verify-email-form'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default async function VerifyEmailPage({searchParams,}: { searchParams: Promise<{ token?: string }> }) {
    // Get translations
    const t = await getTranslations('pages.auth.verifyEmail')

    // Await searchParams to access its properties
    const params = await searchParams
    const token = params.token

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
                <p className="text-text-secondary mb-8">
                    {t('subtitle')}
                </p>
                <VerifyEmailForm token={token} />
            </div>
        </div>
    )
}
