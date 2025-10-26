"use server"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { cache } from 'react';
// Project Libraries
import { SessionService } from '@/src/service/session-service';
import { UserService } from '@/src/service/user-service';

/////////////////////////////
///  CONTROLLER FUNCTIONS ///
/////////////////////////////
/**
 * Session Controller
 * Handles session-related operations for Server Components and Proxy
 */

/**
 * Verifies the current session and returns user data with verification status
 * Used in Server Components and Proxy
 * Cached per-request to avoid multiple session checks
 *
 * @returns User object with email verification status, or null if not authenticated
 */
export const verifySession = cache(async () => {
    const sessionService = new SessionService();
    const userService = new UserService();

    // Check if session is valid
    const isValid = await sessionService.verifySession();
    if (!isValid) {
        return null;
    }

    // Get user from session
    const user = await sessionService.getCurrentSessionUser();
    if (!user) {
        return null;
    }

    // Get fresh email verification status via UserService
    const emailVerified = await userService.getEmailVerificationStatus(user.id);

    return {
        ...user,
        emailVerified,
    };
});

/**
 * Checks session for proxy middleware
 * Optimized for proxy use - includes error handling
 * NOT cached (proxy runs before React)
 *
 * @returns User object with verification status, or null if not authenticated
 */
export async function checkSessionForProxy() {
    try {
        const sessionService = new SessionService();
        const userService = new UserService();

        // Check if session is valid
        const isValid = await sessionService.verifySession();
        if (!isValid) {
            return null;
        }

        // Get user from session
        const user = await sessionService.getCurrentSessionUser();
        if (!user) {
            return null;
        }

        // Get email verification status
        const emailVerified = await userService.getEmailVerificationStatus(user.id);

        return {
            ...user,
            emailVerified,
        };
    } catch (error) {
        console.error('[SessionController] Proxy session check error:', error);
        return null;
    }
}

/**
 * Gets the current authenticated user from session
 * Returns user data directly from session (fastest)
 * Cached per-request
 *
 * @returns User object from session or null if not authenticated
 */
export const getCurrentUser = cache(async () => {
    const sessionService = new SessionService();

    const isValid = await sessionService.verifySession();
    if (!isValid) {
        return null;
    }

    return await sessionService.getCurrentSessionUser();
});

/**
 * Checks if current session is valid
 * Cached per-request
 *
 * @returns True if session is valid and not expired
 */
export const isAuthenticated = cache(async () => {
    const sessionService = new SessionService();
    return await sessionService.verifySession();
});

/**
 * Gets the current user with fresh data from database
 * Use when you need absolutely up-to-date user information
 * Cached per-request
 *
 * @returns User object from database or null if not authenticated
 */
export const getCurrentUserFromDatabase = cache(async () => {
    const sessionService = new SessionService();
    const userService = new UserService();

    const isValid = await sessionService.verifySession();
    if (!isValid) {
        return null;
    }

    const sessionUser = await sessionService.getCurrentSessionUser();
    if (!sessionUser) {
        return null;
    }

    // Fetch fresh user data from database via UserService
    return await userService.findById(sessionUser.id);
});

/**
 * Requires authentication and returns user, or redirects to login
 * Use this in pages that require authentication
 * Cached per-request
 *
 * @returns User object with email verification status
 */
export const requireAuth = cache(async () => {
    const user = await verifySession();

    if (!user) {
        const { redirect } = await import('next/navigation');
        redirect('/login');
    }

    return user;
});
