/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { redirect } from 'next/navigation';
import Link from 'next/link';
// Next-intl Libraries
import { getTranslations } from 'next-intl/server';
// Project Libraries
import { verifySession } from '@/src/controller/session-controller';

/////////////////////////////
///   PAGE COMPONENT      ///
/////////////////////////////
export default async function AccessDeniedPage({searchParams}: {
    searchParams: { required?: string };
}) {
    const t = await getTranslations('pages.auth.accessControl');
    const user = await verifySession();

    // If not authenticated, redirect to login
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-error-light rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-text-primary">
                    {t('accessDenied')}
                </h1>

                <p className="text-text-secondary">
                    {t('noPermission')}
                </p>

                {searchParams.required && (
                    <p className="text-sm text-text-tertiary">
                        {t('requiredRoles')}: {searchParams.required.split(',').join(', ')}
                    </p>
                )}

                <Link
                    href="/dashboard"
                    className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-6 rounded-lg font-medium transition-colors"
                >
                    {t('goToDashboard')}
                </Link>
            </div>
        </div>
    );
}
