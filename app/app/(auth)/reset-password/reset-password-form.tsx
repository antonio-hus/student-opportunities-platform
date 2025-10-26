"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useState, useEffect } from "react"
// Next Libraries
import { useRouter } from "next/navigation"
import Link from "next/link"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { resetPassword, verifyResetToken } from "@/src/controller/auth-controller"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function ResetPasswordForm({ token }: { token?: string }) {
    const t = useTranslations('pages.auth.resetPassword')
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [tokenStatus, setTokenStatus] = useState<'checking' | 'valid' | 'invalid'>('checking')

    // Verify token on mount
    useEffect(() => {
        async function checkToken() {
            if (!token) {
                setTokenStatus('invalid')
                setError(t('noToken'))
                return
            }

            const result = await verifyResetToken(token)

            if (result.valid) {
                setTokenStatus('valid')
            } else {
                setTokenStatus('invalid')
                setError(result.error || t('invalidToken'))
            }
        }

        checkToken()
    }, [token, t])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append("token", token!)

        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'))
            setLoading(false)
            return
        }

        const result = await resetPassword(formData)

        setLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            router.push("/login?reset=success")
        }
    }

    // Show loading while checking token
    if (tokenStatus === 'checking') {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">{t('verifyingToken')}</p>
            </div>
        )
    }

    // Show error if token is invalid
    if (tokenStatus === 'invalid') {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-error-light text-error rounded-lg border border-error">
                    {error}
                </div>
                <div className="text-center">
                    <Link
                        href="/forgot-password"
                        className="text-primary hover:text-primary-hover text-sm font-medium"
                    >
                        {t('requestNew')}
                    </Link>
                </div>
            </div>
        )
    }

    // Show form if token is valid
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-error-light text-error rounded-lg border border-error">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                    {t('newPassword')}
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface text-text-primary"
                />
                <p className="text-xs text-text-secondary mt-1">{t('passwordHint')}</p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                    {t('confirmPassword')}
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface text-text-primary"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? t('resetting') : t('resetPassword')}
            </button>
        </form>
    )
}
