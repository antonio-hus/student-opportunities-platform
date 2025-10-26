/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { redirect } from 'next/navigation';
// Next-intl Libraries
import { getTranslations } from 'next-intl/server';
// Project Libraries
import { verifySession } from '@/src/controller/session-controller';
import VerifyEmailPendingForm from './verify-email-pending-form';

/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default async function VerifyEmailPendingPage() {
    const t = await getTranslations('pages.auth.verifyEmailPending');

    // Verify authentication using session controller
    const user = await verifySession();

    // Must be logged in
    if (!user) {
        redirect('/login');
    }

    // If already verified, redirect to dashboard
    if (user.emailVerified) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-text-secondary">
                        {t('subtitle')} {user.email}
                    </p>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-3">
                        {t('nextSteps')}
                    </h2>
                    <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
                        <li>{t('step1')}</li>
                        <li>{t('step2')}</li>
                        <li>{t('step3')}</li>
                    </ol>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                    <p className="text-sm text-text-secondary mb-4">
                        {t('didNotReceive')}
                    </p>
                    <VerifyEmailPendingForm />
                </div>
            </div>
        </div>
    );
}
