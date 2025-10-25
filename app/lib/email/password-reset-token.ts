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
// Generate password reset token
export async function generatePasswordResetToken(userId: string): Promise<string> {
    // Clean up expired tokens for this user first
    await prisma.passwordResetToken.deleteMany({
        where: {
            userId,
            expiresAt: {
                lt: new Date()
            }
        }
    })

    // Delete any existing valid tokens (only one active reset per user)
    await prisma.passwordResetToken.deleteMany({
        where: { userId }
    })

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex')

    // Store token in database with expiry (1 hour for security)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    })

    return token
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
    // Find token in database
    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    })

    if (!resetToken) {
        return { valid: false, error: 'Invalid or expired reset token' }
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id },
        })
        return { valid: false, error: 'Reset token has expired' }
    }

    return { valid: true, userId: resetToken.userId }
}

// Delete password reset token after use
export async function deletePasswordResetToken(token: string): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
        where: { token }
    })
}
