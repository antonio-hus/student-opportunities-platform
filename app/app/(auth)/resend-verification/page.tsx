/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import ResendVerificationForm from './resend-verification-form'

/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default async function ResendVerificationPage() {
    const t = await getTranslations('pages.auth.resendVerification')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-text-secondary">
                        {t('subtitle')}
                    </p>
                </div>

                <ResendVerificationForm />
            </div>
        </div>
    )
}
