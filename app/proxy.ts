/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Project Libraries
import { verifySession } from '@/lib/auth/dal'

/////////////////////////////
///    MIDDLEWARE CONFIG  ///
/////////////////////////////
// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/applications',
    '/profile',
    '/settings',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
    '/login',
    '/register',
]

/////////////////////////////
///   MIDDLEWARE FUNCTION ///
/////////////////////////////
export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))

    // Verify session
    const session = await verifySession()

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !session.isAuth) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && session.isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow access
    return NextResponse.next()
}

/////////////////////////////
///   MATCHER CONFIG      ///
/////////////////////////////
// Configure which routes this middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
