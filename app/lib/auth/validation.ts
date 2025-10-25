/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

/////////////////////////////
///    EMAIL VALIDATION   ///
/////////////////////////////
// Validate email domain based on user role (students/staff must use university emails)
export async function validateEmailDomain(email: string, role: UserRole): Promise<{ valid: boolean; error?: string }> {
    // Get platform configuration from database
    const config = await prisma.platformConfiguration.findFirst()

    // Allow all emails if no configuration exists
    if (!config) {
        return { valid: true }
    }

    // Validate student email domain
    if (role === "STUDENT" && config.studentEmailDomain) {
        if (!email.endsWith(config.studentEmailDomain)) {
            return {
                valid: false,
                error: `Students must use ${config.studentEmailDomain} email addresses`,
            }
        }
    }

    // Validate staff email domain
    if (role === "COORDINATOR" && config.staffEmailDomain) {
        if (!email.endsWith(config.staffEmailDomain)) {
            return {
                valid: false,
                error: `Staff must use ${config.staffEmailDomain} email addresses`,
            }
        }
    }

    return { valid: true }
}

/////////////////////////////
///  PASSWORD VALIDATION  ///
/////////////////////////////
// Validate password strength requirements
export function validatePassword(password: string): { valid: boolean; error?: string } {
    // Check minimum length
    if (password.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters" }
    }

    return { valid: true }
}
