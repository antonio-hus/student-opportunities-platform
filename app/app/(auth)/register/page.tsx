/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { redirect } from "next/navigation"
// Next-intl Libraries
import { getTranslations } from 'next-intl/server'
// Project Libraries
import { verifySession } from "@/lib/auth/dal"
import RegisterForm from "./register-form"

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default async function RegisterPage() {
    // Get translations
    const t = await getTranslations('pages.auth.register')

    // Check if user is already authenticated
    const session = await verifySession()

    // Redirect to dashboard if already logged in
    if (session.isAuth) {
        redirect("/dashboard")
    }

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-2 text-text-primary">{t('title')}</h1>
            <p className="text-text-secondary mb-8">
                {t('subtitle')}
            </p>
            <RegisterForm />
        </div>
    )
}
