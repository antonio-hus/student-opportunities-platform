/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import ForgotPasswordForm from "./forgot-password-form"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default async function ForgotPasswordPage() {
    // Get translations
    const t = await getTranslations('pages.auth.forgotPassword')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
                <p className="text-text-secondary mb-8">
                    {t('subtitle')}
                </p>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
