/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Node Libraries
import crypto from 'crypto';
// Project Libraries
import { VerificationTokenRepository } from '@/src/repository/verification-token-repository';

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
const VERIFICATION_TOKEN_CONFIG = {
    EXPIRY_HOURS: 24,
    BYTE_LENGTH: 32,
} as const;

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Verification Token Service
 * Handles creation and management of email verification tokens
 */
export class VerificationTokenService {
    private verificationTokenRepository: VerificationTokenRepository;

    constructor() {
        this.verificationTokenRepository = new VerificationTokenRepository();
    }

    /**
     * Generates a cryptographically secure random token string
     *
     * @returns Hexadecimal token string
     */
    private generateToken(): string {
        return crypto.randomBytes(VERIFICATION_TOKEN_CONFIG.BYTE_LENGTH).toString('hex');
    }

    /**
     * Calculates expiration date for verification token
     *
     * @returns Date object representing expiration timestamp (24 hours from now)
     */
    private calculateExpiryDate(): Date {
        return new Date(Date.now() + VERIFICATION_TOKEN_CONFIG.EXPIRY_HOURS * 60 * 60 * 1000);
    }

    /**
     * Creates and stores a new email verification token
     * Automatically deletes any existing verification tokens for the user
     *
     * @param userId - ID of the user to create verification token for
     * @returns The generated verification token string
     */
    async createToken(userId: string): Promise<string> {
        await this.verificationTokenRepository.deleteByUserId(userId);

        const token = this.generateToken();
        const expiresAt = this.calculateExpiryDate();

        await this.verificationTokenRepository.create({
            userId,
            token,
            expiresAt,
        });

        return token;
    }

    /**
     * Verifies a verification token and returns verification result
     *
     * @param token - The verification token to verify
     * @returns Object with validity status, user ID if valid, and error message if invalid
     */
    async verifyToken(token: string) {
        const tokenRecord = await this.verificationTokenRepository.findByToken(token);

        if (!tokenRecord) {
            return {
                valid: false,
                error: 'auth.invalidToken',
            };
        }

        // Check if token is expired
        if (tokenRecord.expiresAt < new Date()) {
            await this.verificationTokenRepository.deleteByToken(token);
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
     * Deletes a verification token after successful verification
     *
     * @param token - The verification token to delete
     */
    async deleteToken(token: string): Promise<void> {
        await this.verificationTokenRepository.deleteByToken(token);
    }

    /**
     * Deletes all verification tokens for a specific user
     * Useful when user changes email or cancels verification
     *
     * @param userId - ID of the user whose tokens should be deleted
     */
    async deleteUserTokens(userId: string): Promise<void> {
        await this.verificationTokenRepository.deleteByUserId(userId);
    }

    /**
     * Cleans up all expired verification tokens from the database
     * Should be called periodically via cron job or scheduled task
     *
     * @returns Number of expired tokens deleted
     */
    async cleanupExpiredTokens(): Promise<void> {
        await this.verificationTokenRepository.deleteExpired();
    }
}
