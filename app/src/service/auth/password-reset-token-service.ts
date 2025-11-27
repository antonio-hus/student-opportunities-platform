/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Node Libraries
import crypto from 'crypto';
// Project Libraries
import { PasswordResetTokenRepository } from '@/src/repository/password-reset-token-repository';

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
const PASSWORD_RESET_TOKEN_CONFIG = {
    EXPIRY_HOURS: 1,
    BYTE_LENGTH: 32,
} as const;

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Password Reset Token Service
 * Handles creation and management of password reset tokens
 */
export class PasswordResetTokenService {
    private passwordResetTokenRepository: PasswordResetTokenRepository;

    constructor() {
        this.passwordResetTokenRepository = new PasswordResetTokenRepository();
    }

    /**
     * Generates a cryptographically secure random token string
     *
     * @returns Hexadecimal token string
     */
    private generateToken(): string {
        return crypto.randomBytes(PASSWORD_RESET_TOKEN_CONFIG.BYTE_LENGTH).toString('hex');
    }

    /**
     * Calculates expiration date for password reset token
     *
     * @returns Date object representing expiration timestamp (1 hour from now)
     */
    private calculateExpiryDate(): Date {
        return new Date(Date.now() + PASSWORD_RESET_TOKEN_CONFIG.EXPIRY_HOURS * 60 * 60 * 1000);
    }

    /**
     * Creates and stores a new password reset token
     * Automatically deletes any existing password reset tokens for the user
     *
     * @param userId - ID of the user to create password reset token for
     * @returns The generated password reset token string
     */
    async createToken(userId: string): Promise<string> {
        await this.passwordResetTokenRepository.deleteByUserId(userId);

        const token = this.generateToken();
        const expiresAt = this.calculateExpiryDate();

        await this.passwordResetTokenRepository.create({
            userId,
            token,
            expiresAt,
        });

        return token;
    }

    /**
     * Verifies a password reset token and returns verification result
     *
     * @param token - The password reset token to verify
     * @returns Object with validity status, user ID if valid, and error message if invalid
     */
    async verifyToken(token: string) {
        const tokenRecord = await this.passwordResetTokenRepository.findByToken(token);

        if (!tokenRecord) {
            return {
                valid: false,
                error: 'auth.invalidResetToken',
            };
        }

        // Check if token is expired
        if (tokenRecord.expiresAt < new Date()) {
            await this.passwordResetTokenRepository.deleteByToken(token);
            return {
                valid: false,
                error: 'auth.tokenExpired',
            };
        }

        return {
            valid: true,
            userId: tokenRecord.userId,
        };
    }

    /**
     * Deletes a password reset token after successful password reset
     *
     * @param token - The password reset token to delete
     */
    async deleteToken(token: string): Promise<void> {
        await this.passwordResetTokenRepository.deleteByToken(token);
    }

    /**
     * Deletes all password reset tokens for a specific user
     * Useful for security when password is changed or user account is compromised
     *
     * @param userId - ID of the user whose tokens should be deleted
     */
    async deleteUserTokens(userId: string): Promise<void> {
        await this.passwordResetTokenRepository.deleteByUserId(userId);
    }

    /**
     * Cleans up all expired password reset tokens from the database
     * Should be called periodically via cron job or scheduled task
     *
     * @returns Number of expired tokens deleted
     */
    async cleanupExpiredTokens(): Promise<void> {
        await this.passwordResetTokenRepository.deleteExpired();
    }
}
