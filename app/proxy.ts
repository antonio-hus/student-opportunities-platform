/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Third-party Libraries
import { getIronSession } from "iron-session"
// Project Libraries
import { SessionData, sessionOptions } from "@/lib/auth/session"

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
    ],
}

/////////////////////////////
///  MIDDLEWARE  SECTION  ///
/////////////////////////////
export async function proxy(request: NextRequest) {
    // Get response
    const response = NextResponse.next()

    // Get session from cookies
    const session = await getIronSession<SessionData>(
        request,
        response,
        sessionOptions
    )

    // Get page type
    // Authentication page
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")
    // Protected page
    const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard")

    // Redirects
    // Redirect to login page if accessing protected page without session
    if (isProtectedPage && !session.isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect to dashboard if accessing auth pages with session
    if (isAuthPage && session.isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Return response
    return response
}
