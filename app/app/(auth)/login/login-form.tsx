"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useState } from "react"
// Next Libraries
import { useRouter } from "next/navigation"
import Link from "next/link"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { signIn } from "@/src/controller/auth-controller"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function LoginForm() {
    const t = useTranslations('pages.auth.login')
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await signIn(formData)

        setLoading(false)

        if (result.error) {
            setError(result.error)
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-error-light text-error rounded-lg border border-error">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    {t('email')}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface text-text-primary"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                        {t('password')}
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                        {t('forgotPassword')}
                    </Link>
                </div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface text-text-primary"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {loading ? t('signingIn') : t('signIn')}
            </button>

            <div className="text-center text-sm text-text-secondary">
                {t('noAccount')}{' '}
                <Link href="/register" className="text-primary hover:text-primary-hover font-medium">
                    {t('createOne')}
                </Link>
            </div>
        </form>
    )
}
