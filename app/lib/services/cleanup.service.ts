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
        const result = await prisma.verificationToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        if (result.count > 0) {
            console.log(`[${new Date().toISOString()}] Cleaned up ${result.count} expired verification tokens`)
        }

        return result.count
    } catch (error) {
        console.error('Token cleanup error:', error)
        return 0
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
