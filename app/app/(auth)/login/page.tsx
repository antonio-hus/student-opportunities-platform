/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { Suspense } from 'react'
// Next-intl Libraries
import {getTranslations} from "next-intl/server";
// Project Libraries
import LoginForm from './login-form'
import { ExpiredSessionNotice } from './expired-session-notice'

/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default async function LoginPage() {
    // Get translations
    const t = await getTranslations('pages.auth.login')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
                <p className="text-text-secondary mb-8">
                    {t('subtitle')}
                </p>
                <Suspense fallback={null}>
                    <ExpiredSessionNotice />
                </Suspense>
                <LoginForm />
            </div>
        </div>
    )
}
