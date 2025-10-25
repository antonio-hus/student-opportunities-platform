/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { Suspense } from 'react'
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import LoginForm from './login-form'
import { ExpiredSessionNotice } from '@/components/auth/expired-session-notice'

/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <Suspense fallback={null}>
                    <ExpiredSessionNotice />
                </Suspense>
                <LoginForm />
            </div>
        </div>
    )
}
