"use server"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import {redirect} from "next/navigation"
import {cookies} from "next/headers"
// Third-party Libraries
import {z} from "zod"
// Project Libraries
import prisma from "@/lib/prisma"
import {hashPassword, verifyPassword} from "@/lib/auth/password"
import {createSession, destroySession} from "@/lib/auth/session"
import {validateEmailDomain} from "@/lib/auth/validation"
import {generateVerificationToken, verifyEmailToken} from "@/lib/email/account-validation-token"
import {sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail} from "@/lib/email/sender"
import {
    deletePasswordResetToken,
    generatePasswordResetToken,
    verifyPasswordResetToken
} from "@/lib/email/password-reset-token"
import {getServerTranslations} from "@/i18n/config"
import {loginLimiter, passwordResetLimiter, signupLimiter} from "@/lib/auth/rate-limit";
import {getClientIp} from "@/lib/auth/get-client-ip";

/////////////////////////////
///   SERVER ACTIONS      ///
/////////////////////////////
export async function signUp(formData: FormData) {
    const { t } = await getServerTranslations()

    // Get client IP for rate limiting
    const ip = await getClientIp()
    const rateLimitResult = signupLimiter.check(3, ip)

    if (!rateLimitResult.success) {
        const waitMinutes = Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
        return {
            error: t('errors.auth.tooManySignups').replace('{minutes}', waitMinutes.toString())
        }
    }

    // Extract and validate form data
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    }

    // Create schema with translated messages
    const signUpSchema = z.object({
        name: z.string().min(2, t('errors.validation.nameMinLength')),
        email: z.string().email(t('errors.validation.invalidEmail')),
        password: z.string().min(8, t('errors.validation.passwordMinLength')),
        role: z.enum(["STUDENT", "COORDINATOR", "ORGANIZATION"]),
    })

    // Validate with Zod
    const parsed = signUpSchema.safeParse(rawData)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { name, email, password, role } = parsed.data

    // Validate email domain based on role
    const domainValidation = await validateEmailDomain(email, role as any)
    if (!domainValidation.valid) {
        return { error: domainValidation.error }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: t('errors.auth.accountExists') }
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user with role-specific profile
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                role: role as any,
                name,
                isActive: true,
                ...(role === "STUDENT" && {
                    student: { create: {} },
                }),
                ...(role === "COORDINATOR" && {
                    coordinator: { create: {} },
                }),
                ...(role === "ORGANIZATION" && {
                    organization: {
                        create: {
                            organizationName: name,
                            type: "OTHER",
                            isVerified: false,
                        },
                    },
                }),
            },
        })

        // Generate verification token
        const token = await generateVerificationToken(user.id)

        // Get user's locale from cookie
        const cookieStore = await cookies()
        const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

        // Send verification email
        await sendVerificationEmail(user.email, user.name || 'User', token, locale)

        // Create session
        await createSession(user.id, user.email, user.role, user.name || undefined)

        return { success: true, needsVerification: true }
    } catch (error) {
        console.error("Sign up error:", error)
        return { error: t('errors.auth.signUpFailed') }
    }
}

export async function signIn(formData: FormData) {
    const { t } = await getServerTranslations()

    const ip = await getClientIp()
    const rateLimitResult = loginLimiter.check(5, ip)

    if (!rateLimitResult.success) {
        const waitMinutes = Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
        return {
            error: t('errors.auth.tooManyAttempts').replace('{minutes}', waitMinutes.toString())
        }
    }

    // Extract and validate form data
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    // Create schema with translated messages
    const signInSchema = z.object({
        email: z.string().email(t('errors.validation.invalidEmail')),
        password: z.string().min(1, t('errors.validation.passwordRequired')),
    })

    // Validate with Zod
    const parsed = signInSchema.safeParse(rawData)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { email, password } = parsed.data

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return { error: t('errors.auth.invalidCredentials') }
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.hashedPassword!)
        if (!isValidPassword) {
            return { error: t('errors.auth.invalidCredentials') }
        }

        // Check if account is active
        if (!user.isActive) {
            return { error: t('errors.auth.accountDeactivated') }
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        })

        // Create session
        await createSession(user.id, user.email, user.role, user.name || undefined)

        return { success: true }
    } catch (error) {
        console.error("Sign in error:", error)
        return { error: t('errors.auth.signInFailed') }
    }
}

export async function signOut() {
    await destroySession()
    redirect("/login")
}

export async function verifyEmail(token: string) {
    const { t, locale } = await getServerTranslations()

    try {
        // Verify token
        const result = await verifyEmailToken(token)

        if (!result.valid) {
            return { success: false, error: result.error }
        }

        // Update user email verification status
        const user = await prisma.user.update({
            where: { id: result.userId },
            data: { emailVerified: new Date() },
        })

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name || 'User', locale)

        return { success: true }
    } catch (error) {
        console.error('Email verification error:', error)
        return { success: false, error: t('errors.auth.verificationFailed') }
    }
}

export async function requestPasswordReset(formData: FormData) {
    const { t, locale } = await getServerTranslations()
    const email = formData.get("email") as string

    if (!email) {
        return { error: t('errors.validation.emailRequired') }
    }

    // Rate limit by IP
    const ip = await getClientIp()
    const rateLimitResult = passwordResetLimiter.check(3, ip)

    if (!rateLimitResult.success) {
        const waitMinutes = Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
        return {
            error: t('errors.auth.tooManyResetRequests').replace('{minutes}', waitMinutes.toString())
        }
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success (don't reveal if email exists)
        if (!user) {
            return { success: true, message: t('success.auth.resetEmailSent') }
        }

        // Generate reset token
        const token = await generatePasswordResetToken(user.id)

        // Send reset email
        await sendPasswordResetEmail(user.email, user.name || 'User', token, locale)

        return { success: true, message: t('success.auth.resetEmailSent') }
    } catch (error) {
        console.error("Password reset request error:", error)
        return { error: t('errors.auth.resetRequestFailed') }
    }
}

export async function resetPassword(formData: FormData) {
    const { t } = await getServerTranslations()
    const token = formData.get("token") as string
    const password = formData.get("password") as string

    if (!token || !password) {
        return { error: t('errors.validation.missingFields') }
    }

    if (password.length < 8) {
        return { error: t('errors.validation.passwordMinLength') }
    }

    try {
        // Verify token
        const result = await verifyPasswordResetToken(token)

        if (!result.valid) {
            return { error: result.error || t('errors.auth.invalidResetToken') }
        }

        // Hash new password
        const hashedPassword = await hashPassword(password)

        // Update user password
        await prisma.user.update({
            where: { id: result.userId },
            data: { hashedPassword },
        })

        // Delete used token
        await deletePasswordResetToken(token)

        return { success: true }
    } catch (error) {
        console.error('Password reset error:', error)
        return { error: t('errors.auth.resetFailed') }
    }
}

export async function verifyResetToken(token: string) {
    const { t } = await getServerTranslations()

    try {
        return await verifyPasswordResetToken(token)
    } catch (error) {
        console.error('Token verification error:', error)
        return { valid: false, error: t('errors.auth.tokenVerificationFailed') }
    }
}
