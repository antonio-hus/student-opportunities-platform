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
} from "@/lib/email/password-reset-token";

/////////////////////////////
///   VALIDATION SCHEMAS  ///
/////////////////////////////
// Sign up validation schema
const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["STUDENT", "COORDINATOR", "ORGANIZATION"]),
})

// Sign in validation schema
const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export async function signUp(formData: FormData) {
    // Extract and validate form data
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    }

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
            return { error: "An account with this email already exists" }
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
                // Email verification starts as null
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

        // Get user's locale from cookie (default to 'en')
        const cookieStore = await cookies()
        const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

        // Send verification email with user's locale
        await sendVerificationEmail(user.email, user.name || 'User', token, locale)

        // Create session (user can browse but with limited access until verified)
        await createSession(user.id, user.email, user.role, user.name || undefined)

        return { success: true, needsVerification: true }
    } catch (error) {
        console.error("Sign up error:", error)
        return { error: "Failed to create account. Please try again." }
    }
}

export async function signIn(formData: FormData) {
    // Extract and validate form data
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

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
            return { error: "Invalid email or password" }
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.hashedPassword!)
        if (!isValidPassword) {
            return { error: "Invalid email or password" }
        }

        // Check if account is active
        if (!user.isActive) {
            return { error: "Your account has been deactivated. Please contact support." }
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
        return { error: "Failed to sign in. Please try again." }
    }
}

export async function signOut() {
    await destroySession()
    redirect("/login")
}

export async function verifyEmail(token: string) {
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

        // Get user's locale from cookie (default to 'en')
        const cookieStore = await cookies()
        const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

        // Send welcome email with user's locale
        await sendWelcomeEmail(user.email, user.name || 'User', locale)

        return { success: true }
    } catch (error) {
        console.error('Email verification error:', error)
        return { success: false, error: 'Failed to verify email' }
    }
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get("email") as string

    if (!email) {
        return { error: "Email is required" }
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success (don't reveal if email exists)
        if (!user) {
            return { success: true, message: "If an account exists, a reset email has been sent" }
        }

        // Generate reset token
        const token = await generatePasswordResetToken(user.id)

        // Get user's locale
        const cookieStore = await cookies()
        const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

        // Send reset email
        await sendPasswordResetEmail(user.email, user.name || 'User', token, locale)

        return { success: true, message: "If an account exists, a reset email has been sent" }
    } catch (error) {
        console.error("Password reset request error:", error)
        return { error: "Failed to process request. Please try again." }
    }
}

export async function resetPassword(formData: FormData) {
    const token = formData.get("token") as string
    const password = formData.get("password") as string

    if (!token || !password) {
        return { error: "Missing required fields" }
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" }
    }

    try {
        // Verify token
        const result = await verifyPasswordResetToken(token)

        if (!result.valid) {
            return { error: result.error || "Invalid reset token" }
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
        return { error: 'Failed to reset password' }
    }
}

export async function verifyResetToken(token: string) {
    try {
        return await verifyPasswordResetToken(token)
    } catch (error) {
        console.error('Token verification error:', error)
        return { valid: false, error: 'Failed to verify token' }
    }
}