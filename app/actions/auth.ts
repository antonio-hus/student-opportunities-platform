"use server"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { redirect } from "next/navigation"
// Third-party Libraries
import { z } from "zod"
// Project Libraries
import prisma from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createSession, destroySession } from "@/lib/auth/session"
import { validateEmailDomain, validatePassword as validatePasswordStrength } from "@/lib/auth/validation"
import { UserRole } from "@prisma/client"

/////////////////////////////
///  VALIDATION SCHEMAS   ///
/////////////////////////////
// Sign up form validation schema
const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["STUDENT", "COORDINATOR", "ORGANIZATION"]),
})

// Sign in form validation schema
const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

/////////////////////////////
///    ACTIONS SECTION    ///
/////////////////////////////
// Sign up action
export async function signUp(formData: FormData) {
    // Validate input
    const validatedFields = signUpSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues[0].message,
        }
    }

    const { name, email, password, role } = validatedFields.data

    // Validate email domain
    const domainValidation = await validateEmailDomain(email, role as UserRole)
    if (!domainValidation.valid) {
        return { error: domainValidation.error }
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
        return { error: passwordValidation.error }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Email already registered" }
    }

    try {
        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user with role-specific profile
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                role: role as UserRole,
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

        // Auto-verify for students and coordinators (TODO: Send verification email)
        if (role === "STUDENT" || role === "COORDINATOR") {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            })
        }

        // Create session
        await createSession(user.id, user.email, user.role, user.name || undefined)

        return { success: true }
    } catch (error) {
        console.error("Sign up error:", error)
        return { error: "Failed to create account. Please try again." }
    }
}

// Sign in action
export async function signIn(formData: FormData) {
    // Validate input
    const validatedFields = signInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues[0].message,
        }
    }

    const { email, password } = validatedFields.data

    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !user.hashedPassword) {
            return { error: "Invalid email or password" }
        }

        // Check if account is active
        if (!user.isActive || user.isSuspended) {
            return { error: "Account is inactive or suspended" }
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.hashedPassword)

        if (!isValidPassword) {
            return { error: "Invalid email or password" }
        }

        // Check email verification (except for organizations)
        if (user.role !== "ORGANIZATION" && !user.emailVerified) {
            return { error: "Please verify your email address first" }
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

// Sign out action
export async function signOut() {
    await destroySession()
    redirect("/login")
}
