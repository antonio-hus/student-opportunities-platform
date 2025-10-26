"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { useEffect, useState } from "react"
// Next Libraries
import { useRouter } from "next/navigation"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { verifyEmail } from "@/src/controller/auth-controller"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function VerifyEmailForm({ token }: { token?: string }) {
    // Get translations
    const t = useTranslations('pages.auth.verifyEmail')

    // Router for navigation
    const router = useRouter()

    // State management
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    // Verify token on mount
    useEffect(() => {
        async function verify() {
            if (!token) {
                setStatus('error')
                setMessage(t('noToken'))
                return
            }

            const result = await verifyEmail(token)

            if (result.success) {
                setStatus('success')
                setMessage(t('success'))
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    router.push('/dashboard')
                    router.refresh()
                }, 3000)
            } else {
                setStatus('error')
                setMessage(result.error || t('failed'))
            }
        }

        verify()
    }, [token, router, t])

    return (
        <div className="bg-surface border border-border rounded-lg p-6">
            {status === 'loading' && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">{t('verifying')}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center">
                    <div className="bg-success-light text-success p-4 rounded-lg mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium">{message}</p>
                    </div>
                    <p className="text-text-secondary text-sm">{t('redirecting')}</p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-center">
                    <div className="bg-error-light text-error p-4 rounded-lg mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="font-medium">{message}</p>
                    </div>
                    <a href="/login" className="text-primary hover:underline">
                        {t('backToLogin')}
                    </a>
                </div>
            )}
        </div>
    )
}
