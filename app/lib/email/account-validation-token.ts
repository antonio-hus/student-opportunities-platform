/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Node Libraries
import crypto from 'crypto'
// Project Libraries
import prisma from '@/lib/prisma'

/////////////////////////////
///   TOKEN MANAGEMENT    ///
/////////////////////////////
// Generate verification token
export async function generateVerificationToken(userId: string): Promise<string> {
    // Generate random token
    const token = crypto.randomBytes(32).toString('hex')

    // Store token in database with expiry (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    })

    return token
}

// Verify token and return user ID
export async function verifyEmailToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
    // Find token in database
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    })

    if (!verificationToken) {
        return { valid: false, error: 'Invalid verification token' }
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        })
        return { valid: false, error: 'Verification token has expired' }
    }

    // Delete token after use
    await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
    })

    return { valid: true, userId: verificationToken.userId }
}

// Resend verification email
export async function resendVerificationToken(userId: string): Promise<string> {
    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
        where: { userId },
    })

    // Generate new token
    return generateVerificationToken(userId)
}
