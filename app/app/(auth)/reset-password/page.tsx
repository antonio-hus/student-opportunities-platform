/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import ResetPasswordForm from "./reset-password-form"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default async function ResetPasswordPage({searchParams,}: { searchParams: Promise<{ token?: string }> }) {

    // Get translations
    const t = await getTranslations('pages.auth.resetPassword')

    // Await searchParams
    const params = await searchParams
    const token = params.token

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
            <p className="text-text-secondary mb-8">
                {t('subtitle')}
            </p>
            <ResetPasswordForm token={token} />
        </div>
    )
}
