"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { useState, useEffect } from 'react'
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { resendVerificationEmailAuthenticated } from '@/src/controller/auth-controller'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function VerifyEmailPendingForm({ userEmail }: { userEmail: string }) {
    const t = useTranslations('pages.auth.verifyEmailPending')
    const [loading, setLoading] = useState(false)
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
                disabled={loading || countdown > 0}
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
        </div>
    )
}
