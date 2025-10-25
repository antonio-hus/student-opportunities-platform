/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { cookies } from 'next/headers'
// Third-party Libraries
import { getIronSession, SessionOptions } from 'iron-session'

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
export interface SessionData {
    userId: string
    email: string
    role: string
    name?: string
    isAuth: boolean
    createdAt: number
    expiresAt: number
}

/////////////////////////////
///   SESSION OPTIONS     ///
/////////////////////////////
export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: 'session',
    ttl: 60 * 60 * 24 * 7, // 7 days
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
}

/////////////////////////////
///  SESSION MANAGEMENT   ///
/////////////////////////////
export async function getSession() {
    const cookieStore = await cookies()
    return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function createSession(
    userId: string,
    email: string,
    role: string,
    name?: string
) {
    const session = await getSession()
    const now = Date.now()

    session.userId = userId
    session.email = email
    session.role = role
    session.name = name
    session.isAuth = true
    session.createdAt = now
    session.expiresAt = now + (sessionOptions.ttl! * 1000)

    await session.save()
}

export async function destroySession() {
    const session = await getSession()
    session.destroy()
}

// Check if session is expired
export async function isSessionExpired(): Promise<boolean> {
    const session = await getSession()

    if (!session.isAuth || !session.expiresAt) {
        return true
    }

    return Date.now() > session.expiresAt
}

// Refresh session expiry
export async function refreshSession() {
    const session = await getSession()

    if (session.isAuth) {
        const now = Date.now()
        session.expiresAt = now + (sessionOptions.ttl! * 1000)
        await session.save()
    }
}
