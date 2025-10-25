"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useState } from "react"
// Next Libraries
import { useRouter } from "next/navigation"
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { signIn } from "@/actions/auth"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function LoginForm() {
    // Get translations
    const t = useTranslations('pages.auth.login')

    // Router for navigation
    const router = useRouter()

    // State management
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Handle form submission
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Submit form data to server action
        const formData = new FormData(e.currentTarget)
        const result = await signIn(formData)

        // Handle result
        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Redirect to dashboard on success
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <>
            {/* Error message display */}
            {error && (
                <div className="bg-error-light border border-error text-error px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary">
                        {t('email')}
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Password field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-text-primary">
                        {t('password')}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? t('signingIn') : t('signIn')}
                </button>
            </form>

            {/* Registration link */}
            <p className="mt-4 text-center text-sm text-text-secondary">
                {t('noAccount')}{" "}
                <a href="/register" className="text-primary hover:underline font-medium">
                    {t('createOne')}
                </a>
            </p>
        </>
    )
}
