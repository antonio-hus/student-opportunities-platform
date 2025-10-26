/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from '@/src/database'
import {PasswordResetToken} from '@/src/domain/password-reset-token';

/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
export class PasswordResetTokenRepository {
    /**
     * Creates a new password reset token record for a given user.
     *
     * @param data - Object containing userId, token, and expiration timestamp.
     * @returns The created PasswordResetToken record.
     */
    async create(data: {
        userId: string
        token: string
        expiresAt: Date
    }): Promise<PasswordResetToken> {
        return prisma.passwordResetToken.create({ data })
    }

    /**
     * Finds a password reset token by its token string.
     *
     * @param token - The token string to search for.
     * @returns The matching PasswordResetToken record, or null if not found.
     */
    async findByToken(token: string): Promise<PasswordResetToken | null> {
        return prisma.passwordResetToken.findUnique({
            where: { token },
        })
    }

    /**
     * Deletes a password reset token by its token string.
     *
     * @param token - The token string identifying the record to delete.
     */
    async deleteByToken(token: string): Promise<void> {
        await prisma.passwordResetToken.delete({
            where: { token },
        })
    }

    /**
     * Deletes all password reset tokens associated with a specific user.
     *
     * @param userId - The ID of the user whose tokens should be deleted.
     */
    async deleteByUserId(userId: string): Promise<void> {
        await prisma.passwordResetToken.deleteMany({
            where: { userId },
        })
    }

    /**
     * Deletes all expired password reset tokens
     * Used by cleanup service to remove stale tokens
     *
     * @returns Object with count of deleted tokens
     */
    async deleteExpired(): Promise<{ count: number }> {
        return prisma.passwordResetToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }

}
