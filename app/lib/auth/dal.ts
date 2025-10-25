/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
import { getSession, isSessionExpired, refreshSession } from './session'

/////////////////////////////
/// SESSION  VERIFICATION ///
/////////////////////////////
export async function verifySession() {
    const session = await getSession()

    // Check if user is authenticated
    if (!session.isAuth) {
        return { isAuth: false, userId: null }
    }

    // Check if session is expired
    const expired = await isSessionExpired()
    if (expired) {
        // Destroy expired session
        session.destroy()
        return { isAuth: false, userId: null }
    }

    // Session is valid, refresh it (extend expiry)
    await refreshSession()

    return {
        isAuth: true,
        userId: session.userId,
        email: session.email,
        role: session.role,
        name: session.name,
    }
}
