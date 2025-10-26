/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import {cookies} from 'next/headers';
// Third-party Libraries
import {getIronSession, SessionOptions} from 'iron-session';
// Project Libraries
import {User} from '@/src/domain/user';
import {SessionData} from '@/src/domain/session';


/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
/**
 * Configuration options for iron-session
 * Defines cookie settings, TTL, and security options for session management
 */
const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: 'session',
    ttl: 60 * 60 * 24 * 7, // 7 days in seconds
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    },
}


/////////////////////////////
///  REPOSITORY  SECTION  ///
/////////////////////////////
/**
 * Repository for managing user sessions using iron-session
 * Handles session storage in encrypted, signed cookies for stateless authentication
 */
export class SessionRepository {
    /**
     * Retrieves the current iron-session instance from browser cookies
     * Automatically decrypts and validates the session data
     *
     * @returns The current session object containing user data and authentication state
     */
    async getSession() {
        const cookieStore = await cookies()
        return getIronSession<SessionData>(cookieStore, sessionOptions)
    }

    /**
     * Creates a new authenticated session for a user
     * Sets authentication state, user data, and calculates expiration timestamp
     *
     * @param user - The user object to store in the session
     */
    async createSession(user: User) {
        const session = await this.getSession()
        const now = Date.now()

        session.user = user
        session.isAuth = true
        session.createdAt = now
        session.expiresAt = now + (sessionOptions.ttl! * 1000)

        await session.save()
    }

    /**
     * Destroys the current session by removing the encrypted cookie
     * Effectively logs out the user by clearing all session data
     */
    async destroySession() {
        const session = await this.getSession()
        session.destroy()
    }

    /**
     * Checks if the current session has expired based on the expiresAt timestamp
     *
     * @returns True if session is expired or invalid, false if session is still valid
     */
    async isSessionExpired(): Promise<boolean> {
        const session = await this.getSession()

        if (!session.isAuth || !session.expiresAt) {
            return true
        }

        return Date.now() > session.expiresAt
    }

    /**
     * Extends the current session's expiration time by resetting the expiresAt timestamp
     * Only refreshes if the session is currently authenticated
     */
    async refreshSession() {
        const session = await this.getSession()

        if (session.isAuth) {
            const now = Date.now()
            session.expiresAt = now + (sessionOptions.ttl! * 1000)
            await session.save()
        }
    }
}
