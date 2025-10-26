/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import RegisterForm from "./register-form"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default async function RegisterPage() {
    // Get translations
    const t = await getTranslations('pages.auth.register')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
                <p className="text-text-secondary mb-8">
                    {t('subtitle')}
                </p>
                <RegisterForm />
            </div>
        </div>
    )
}
