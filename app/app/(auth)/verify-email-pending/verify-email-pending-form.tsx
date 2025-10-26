"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { useState, useEffect } from 'react'
// Next Libraries
import { useRouter } from 'next/navigation'
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { resendVerificationEmailAuthenticated, signOut } from '@/src/controller/auth-controller'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function VerifyEmailPendingForm() {
    const t = useTranslations('pages.auth.verifyEmailPending')
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [countdown, setCountdown] = useState(120)

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

    async function handleResend() {
        setLoading(true)
        setMessage(null)

        const result = await resendVerificationEmailAuthenticated()

        setLoading(false)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: result.message || t('emailSent') })
            // Reset countdown to 120 seconds
            setCountdown(120)
        }
    }

    async function handleSignOut() {
        setSigningOut(true)
        await signOut()
        router.push('/login')
    }

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-3 rounded-lg border text-sm ${
                    message.type === 'success'
                        ? 'bg-success-light text-success border-success'
                        : 'bg-error-light text-error border-error'
                }`}>
                    {message.text}
                </div>
            )}

            <button
                onClick={handleResend}
                disabled={loading || countdown > 0 || signingOut}
                className="w-full bg-secondary hover:bg-secondary-hover text-text-primary py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    t('sending')
                ) : countdown > 0 ? (
                    t('resendIn') + " " + countdown.toString() + " " + t('seconds')
                ) : (
                    t('resendButton')
                )}
            </button>

            {countdown > 0 && (
                <p className="text-xs text-center text-text-secondary">
                    {t('waitMessage')}
                </p>
            )}

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-surface px-2 text-text-secondary">
                        {t('or')}
                    </span>
                </div>
            </div>

            <button
                onClick={handleSignOut}
                disabled={signingOut || loading}
                className="w-full bg-transparent hover:bg-surface text-text-secondary border border-border py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {signingOut ? t('signingOut') : t('signOut')}
            </button>

            <p className="text-xs text-center text-text-secondary">
                {t('signOutHelp')}
            </p>
        </div>
    )
}
