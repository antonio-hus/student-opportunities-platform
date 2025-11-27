/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import cron from 'node-cron';
// Project Libraries
import { VerificationTokenService } from '@/src/service/auth/verification-token-service';
import { PasswordResetTokenService } from '@/src/service/auth/password-reset-token-service';

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Cleanup Service
 * Handles scheduled cleanup of expired tokens using cron jobs
 * Implements singleton pattern to ensure only one cleanup scheduler runs
 */
export class CleanupService {
    private static instance: CleanupService;
    private verificationTokenService: VerificationTokenService;
    private passwordResetTokenService: PasswordResetTokenService;
    private isSchedulerRunning: boolean = false;

    /**
     * Private constructor to prevent direct instantiation
     * Use CleanupService.getInstance() instead
     */
    private constructor() {
        this.verificationTokenService = new VerificationTokenService();
        this.passwordResetTokenService = new PasswordResetTokenService();
    }

    /**
     * Gets the singleton instance of CleanupService
     * Creates a new instance if one doesn't exist
     *
     * @returns The singleton CleanupService instance
     */
    static getInstance(): CleanupService {
        if (!CleanupService.instance) {
            CleanupService.instance = new CleanupService();
        }
        return CleanupService.instance;
    }

    /**
     * Cleans up all expired tokens from the database
     * Removes both verification tokens and password reset tokens
     *
     * @returns Summary of cleanup operation with counts
     */
    async cleanupExpiredTokens() {
        try {
            // Clean up expired verification tokens
            await this.verificationTokenService.cleanupExpiredTokens();

            // Clean up expired password reset tokens
            await this.passwordResetTokenService.cleanupExpiredTokens();
        } catch (error) {
            console.error('[CleanupService] Token cleanup error:', error);
        }
    }

    /**
     * Starts the scheduled cleanup task
     * Runs daily at midnight UTC and immediately on startup
     * Prevents multiple schedulers from running simultaneously
     */
    startScheduler() {
        // Prevent multiple schedulers from starting
        if (this.isSchedulerRunning) {
            console.log('[CleanupService] Scheduler already running, skipping initialization');
            return;
        }

        // Run once every 24 hours at midnight UTC
        // Pattern: 0 0 * * * (minute hour day month weekday)
        cron.schedule('0 0 * * *', async () => {
            console.log(`[${new Date().toISOString()}] Starting scheduled token cleanup...`);
            await this.cleanupExpiredTokens();
        });

        this.isSchedulerRunning = true;
        console.log('[CleanupService] Cleanup scheduler started (runs daily at midnight UTC)');

        // Run cleanup immediately on startup to clear any existing expired tokens
        this.cleanupExpiredTokens()
            .then(() => console.log('[CleanupService] Initial cleanup completed'))
            .catch(error => console.error('[CleanupService] Initial cleanup failed:', error));
    }

    /**
     * Checks if the cleanup scheduler is currently running
     *
     * @returns True if scheduler is active, false otherwise
     */
    isRunning(): boolean {
        return this.isSchedulerRunning;
    }
}

// Export singleton instance getter
export const getCleanupService = () => CleanupService.getInstance();

// Export convenience method for starting the scheduler
export const startCleanupScheduler = () => {
    const cleanupService = CleanupService.getInstance();
    cleanupService.startScheduler();
};
