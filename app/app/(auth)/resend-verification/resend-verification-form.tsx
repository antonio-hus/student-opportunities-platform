"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useState, useEffect } from "react"
// Next Libraries
import Link from "next/link"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { resendVerificationEmail } from '@/src/controller/auth/auth-controller'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function ResendVerificationForm() {
    const t = useTranslations('pages.auth.resendVerification')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // Countdown timer effect
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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await resendVerificationEmail(formData)

        setLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || t('success'))
            // Start 120 second countdown
            setCountdown(120)
        }
    }

    return (
        <div className="bg-surface border border-border rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-error-light text-error rounded-lg border border-error">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-success-light text-success rounded-lg border border-success">
                        <p className="text-sm font-medium">{success}</p>
                        <p className="text-xs mt-1">{t('checkInbox')}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        {t('emailLabel')}
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={loading || countdown > 0}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('emailPlaceholder')}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || countdown > 0}
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        t('sending')
                    ) : countdown > 0 ? (
                        t('resendIn').replace('{seconds}', countdown.toString())
                    ) : (
                        t('sendButton')
                    )}
                </button>

                {countdown > 0 && (
                    <p className="text-xs text-center text-text-secondary">
                        {t('waitMessage')}
                    </p>
                )}

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                        {t('backToLogin')}
                    </Link>
                </div>
            </form>
        </div>
    )
}
