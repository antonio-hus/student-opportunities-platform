/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Project Libraries
import { checkSessionForProxy } from '@/src/controller/session-controller';
import { UserRole } from '@/src/domain/user';

/////////////////////////////
///    PROXY CONFIG       ///
/////////////////////////////
/**
 * Routes that require authentication
 */
const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/applications',
    '/profile',
    '/settings',
];

/**
 * Routes with role-based access control
 * Maps route prefixes to allowed roles
 */
const roleBasedRoutes: Record<string, UserRole[]> = {
    '/admin': [UserRole.ADMINISTRATOR],
    '/coordinator': [UserRole.ADMINISTRATOR, UserRole.COORDINATOR],
    '/organization': [UserRole.ADMINISTRATOR, UserRole.ORGANIZATION],
    '/student': [UserRole.ADMINISTRATOR, UserRole.STUDENT],
};

/**
 * Routes that should redirect if authenticated
 */
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
];

/**
 * Public routes (always accessible)
 */
const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/verify-email',
    '/reset-password',
    '/verify-email-pending',
    '/access-denied',
];

/////////////////////////////
///   HELPER FUNCTIONS    ///
/////////////////////////////
/**
 * Checks if a path requires specific roles
 *
 * @param path - Request path
 * @returns Array of allowed roles, or null if no role restriction
 */
function getRequiredRoles(path: string): UserRole[] | null {
    for (const [routePrefix, roles] of Object.entries(roleBasedRoutes)) {
        if (path.startsWith(routePrefix)) {
            return roles;
        }
    }
    return null;
}

/**
 * Checks if user has permission to access a route
 *
 * @param userRole - User's role
 * @param requiredRoles - Required roles for the route
 * @returns True if user has access, false otherwise
 */
function hasRoleAccess(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(userRole);
}

/////////////////////////////
///   PROXY FUNCTION      ///
/////////////////////////////
/**
 * Next.js 16 Proxy Function
 * Handles authentication, email verification, and role-based access control
 */
export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isRoleBasedRoute = getRequiredRoles(path) !== null;
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route));

    // Allow public routes without session check (except auth and protected routes)
    if (isPublicRoute && !isAuthRoute && !isProtectedRoute && !isRoleBasedRoute) {
        return NextResponse.next();
    }

    // Check session
    const user = await checkSessionForProxy();
    const isAuthenticated = user !== null;

    // AUTHENTICATION CHECK: Redirect to login if not authenticated
    if ((isProtectedRoute || isRoleBasedRoute) && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    // EMAIL VERIFICATION CHECK: Redirect if email not verified
    if ((isProtectedRoute || isRoleBasedRoute) && isAuthenticated && !user.emailVerified) {
        if (path !== '/verify-email-pending') {
            return NextResponse.redirect(new URL('/verify-email-pending', request.url));
        }
    }

    // ROLE-BASED ACCESS CONTROL: Check user role
    if (isRoleBasedRoute && isAuthenticated) {
        const requiredRoles = getRequiredRoles(path);

        if (requiredRoles && !hasRoleAccess(user.role, requiredRoles)) {
            // User doesn't have required role - redirect to access denied
            const accessDeniedUrl = new URL('/access-denied', request.url);
            accessDeniedUrl.searchParams.set('required', requiredRoles.join(','));
            return NextResponse.redirect(accessDeniedUrl);
        }
    }

    // AUTH ROUTES: Redirect to dashboard if already authenticated
    if (isAuthRoute && isAuthenticated) {
        if (!user.emailVerified) {
            return NextResponse.redirect(new URL('/verify-email-pending', request.url));
        }

        // Redirect to appropriate dashboard based on role
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow access
    return NextResponse.next();
}

/////////////////////////////
///   MATCHER CONFIG      ///
/////////////////////////////
export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - api routes
         * - static files
         * - images
         */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|otf)$).*)',
    ],
};
