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
export default async function VerifyEmailPage({
                                                  searchParams,
                                              }: {
    searchParams: Promise<{ token?: string }>
}) {
    // Get translations
    const t = await getTranslations('auth.verifyEmail')

    // Await searchParams to access its properties
    const params = await searchParams
    const token = params.token

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
            <p className="text-text-secondary mb-8">
                {t('subtitle')}
            </p>
            <VerifyEmailForm token={token} />
        </div>
    )
}
