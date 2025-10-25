/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import "server-only"
import { cache } from "react"
// Project Libraries
import { getSession } from "./session"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

/////////////////////////////
///  SESSION  MANAGEMENT  ///
/////////////////////////////
// Cache the session for the duration of the request to avoid multiple DB calls
export const verifySession = cache(async () => {
    // Get session from encrypted cookie
    const session = await getSession()

    // Return auth status false if not logged in
    if (!session.isLoggedIn) {
        return { isAuth: false, userId: null, role: null }
    }

    // Return session data if authenticated
    return {
        isAuth: true,
        userId: session.userId,
        email: session.email,
        role: session.role,
        name: session.name,
    }
})

// Get current user with full profile details (cached for request duration)
export const getCurrentUser = cache(async () => {
    // Verify session exists
    const session = await verifySession()

    if (!session.isAuth || !session.userId) {
        return null
    }

    try {
        // Fetch user with role-specific profile data
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                profilePictureUrl: true,
                emailVerified: true,
                isActive: true,
                isSuspended: true,
                lastLoginAt: true,
                // Student profile
                student: {
                    select: {
                        id: true,
                        studyProgram: true,
                        yearOfStudy: true,
                        bio: true,
                        skills: true,
                        totalHoursContributed: true,
                        projectsCompleted: true,
                    },
                },
                // Coordinator profile
                coordinator: {
                    select: {
                        id: true,
                        department: true,
                        title: true,
                        areasOfExpertise: true,
                    },
                },
                // Organization profile
                organization: {
                    select: {
                        id: true,
                        organizationName: true,
                        type: true,
                        isVerified: true,
                        totalProjects: true,
                        completedProjects: true,
                    },
                },
                // Administrator profile
                administrator: {
                    select: {
                        id: true,
                        department: true,
                        permissions: true,
                    },
                },
            },
        })

        // Return null if user not found, inactive, or suspended
        if (!user || !user.isActive || user.isSuspended) {
            return null
        }

        return user
    } catch {
        return null
    }
})

/////////////////////////////
/// PERMISSION MANAGEMENT ///
/////////////////////////////
// Require authentication (throws error if not authenticated)
export async function requireAuth() {
    const session = await verifySession()

    if (!session.isAuth) {
        throw new Error("Unauthorized")
    }

    return session
}

// Require specific role(s) (throws error if unauthorized)
export async function requireRole(allowedRoles: UserRole[]) {
    const session = await requireAuth()

    if (!session.role || !allowedRoles.includes(session.role)) {
        throw new Error("Forbidden: Insufficient permissions")
    }

    return session
}

// Require student role
export async function requireStudent() {
    return requireRole(["STUDENT"])
}

// Require coordinator role
export async function requireCoordinator() {
    return requireRole(["COORDINATOR"])
}

// Require organization role
export async function requireOrganization() {
    return requireRole(["ORGANIZATION"])
}

// Require administrator role
export async function requireAdmin() {
    return requireRole(["ADMINISTRATOR"])
}
