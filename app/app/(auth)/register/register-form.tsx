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
import { signUp } from "@/src/controller/auth/auth-controller"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function RegisterForm() {
    // Get translations
    const t = useTranslations('pages.auth.register')

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
        const result = await signUp(formData)

        // Handle result
        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Redirect to dashboard on success
            router.push("/verify-email-pending")
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

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-primary">
                        {t('fullName')}
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

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

                {/* Role selection */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium mb-2 text-text-primary">
                        {t('role')}
                    </label>
                    <select
                        id="role"
                        name="role"
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="STUDENT">{t('roleStudent')}</option>
                        <option value="COORDINATOR">{t('roleCoordinator')}</option>
                        <option value="ORGANIZATION">{t('roleOrganization')}</option>
                    </select>
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
                        minLength={8}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-sm text-text-secondary mt-1">
                        {t('passwordHint')}
                    </p>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? t('creatingAccount') : t('createAccount')}
                </button>
            </form>

            {/* Login link */}
            <p className="mt-4 text-center text-sm text-text-secondary">
                {t('hasAccount')}{" "}
                <a href="/login" className="text-primary hover:underline font-medium">
                    {t('signIn')}
                </a>
            </p>
        </>
    )
}
