/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import { getIronSession, SessionOptions } from "iron-session"
// Next Libraries
import { cookies } from "next/headers"
// Prisma Libraries
import { UserRole } from "@prisma/client"

/////////////////////////////
///   TYPE DEFINITIONS    ///
/////////////////////////////
// Session data structure stored in encrypted cookie
export interface SessionData {
    userId: string
    email: string
    role: UserRole
    name?: string
    isLoggedIn: boolean
}

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Iron-session configuration for encrypted cookies
export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: "university-platform-session",
    cookieOptions: {
        // Prevent client-side JavaScript access
        httpOnly: true,
        // HTTPS only in production
        secure: process.env.NODE_ENV === "production",
        // CSRF protection
        sameSite: "lax",
        // 7 days
        maxAge: 60 * 60 * 24 * 7,
    },
}

/////////////////////////////
///  SESSION  MANAGEMENT  ///
/////////////////////////////
// Get current session from encrypted cookie
export async function getSession() {
    const cookieStore = await cookies()
    return getIronSession<SessionData>(cookieStore, sessionOptions)
}

// Create new session with user data
export async function createSession(userId: string, email: string, role: UserRole, name?: string) {
    const session = await getSession()

    session.userId = userId
    session.email = email
    session.role = role
    session.name = name
    session.isLoggedIn = true

    await session.save()
}

// Destroy current session (logout)
export async function destroySession() {
    const session = await getSession()
    session.destroy()
}
