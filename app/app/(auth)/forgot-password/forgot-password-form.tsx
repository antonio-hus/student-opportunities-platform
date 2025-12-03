"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useState } from "react"
// Next Libraries
import Link from "next/link"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { requestPasswordReset } from "@/src/controller/auth/auth-controller"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function ForgotPasswordForm() {
    const t = useTranslations('pages.auth.forgotPassword')
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await requestPasswordReset(formData)

        setLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            setMessage(result.message || t('success'))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-error-light text-error rounded-lg border border-error">
                    {error}
                </div>
            )}

            {message && (
                <div className="p-4 bg-success-light text-success rounded-lg border border-success">
                    {message}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    {t('emailLabel')}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface text-text-primary"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? t('sending') : t('sendButton')}
            </button>

            <div className="text-center">
                <Link href="/login" className="text-primary hover:text-primary-hover text-sm">
                    {t('backToLogin')}
                </Link>
            </div>
        </form>
    )
}
