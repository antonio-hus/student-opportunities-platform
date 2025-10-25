/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { NextResponse } from "next/server"
// Project Libraries
import { getCurrentUser } from "@/lib/auth/dal"

/////////////////////////////
///     ROUTE SECTION     ///
/////////////////////////////
// Get current authenticated user data
export async function GET() {
    // Fetch current user from session
    const user = await getCurrentUser()

    // Return 401 if not authenticated
    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 })
    }

    // Return user data
    return NextResponse.json({ user })
}
