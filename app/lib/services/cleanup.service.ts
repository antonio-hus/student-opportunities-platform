/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import cron from 'node-cron'
// Project Libraries
import prisma from '@/lib/prisma'

/////////////////////////////
///   CLEANUP FUNCTION    ///
/////////////////////////////
export async function cleanupExpiredTokens() {
    try {
        // Delete expired verification tokens
        const verificationResult = await prisma.verificationToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        // Delete expired password reset tokens
        const passwordResetResult = await prisma.passwordResetToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        const totalDeleted = verificationResult.count + passwordResetResult.count

        if (totalDeleted > 0) {
            console.log(`[${new Date().toISOString()}] Cleaned up ${verificationResult.count} verification tokens and ${passwordResetResult.count} password reset tokens`)
        }

        return {
            verificationTokens: verificationResult.count,
            passwordResetTokens: passwordResetResult.count,
            total: totalDeleted
        }
    } catch (error) {
        console.error('Token cleanup error:', error)
        return {
            verificationTokens: 0,
            passwordResetTokens: 0,
            total: 0
        }
    }
}

/////////////////////////////
///   CRON SCHEDULER      ///
/////////////////////////////
export function startCleanupScheduler() {
    // Run once every 24 hours at midnight UTC
    // Pattern: 0 0 * * * (minute hour day month weekday)

    cron.schedule('0 0 * * *', async () => {
        console.log(`[${new Date().toISOString()}] Starting token cleanup...`)
        await cleanupExpiredTokens()
    })

    console.log('Cleanup scheduler started (runs daily at midnight UTC)')

    // Run cleanup immediately on startup to clear any existing expired tokens
    cleanupExpiredTokens()
}
