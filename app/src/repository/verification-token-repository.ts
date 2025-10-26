/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from '@/src/database'
import {VerificationToken} from '@/src/domain/verification-token';


/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
export class VerificationTokenRepository {
    /**
     * Creates a new verification token record for a given user.
     *
     * @param data - Object containing userId, token, and expiration timestamp.
     * @returns The created VerificationToken record.
     */
    async create(data: {
        userId: string
        token: string
        expiresAt: Date
    }): Promise<VerificationToken> {
        return prisma.verificationToken.create({ data })
    }

    /**
     * Finds a verification token by its token string.
     *
     * @param token - The token string to search for.
     * @returns The matching VerificationToken record, or null if not found.
     */
    async findByToken(token: string): Promise<VerificationToken | null> {
        return prisma.verificationToken.findUnique({
            where: { token },
        })
    }

    /**
     * Deletes a verification token by its token string.
     *
     * @param token - The token string identifying the record to delete.
     */
    async deleteByToken(token: string): Promise<void> {
        await prisma.verificationToken.delete({
            where: { token },
        })
    }

    /**
     * Deletes all verification tokens associated with a specific user.
     *
     * @param userId - The ID of the user whose verification tokens should be deleted.
     */
    async deleteByUserId(userId: string): Promise<void> {
        await prisma.verificationToken.deleteMany({
            where: { userId },
        })
    }

    /**
     * Deletes all expired verification tokens
     * Used by cleanup service to remove stale tokens
     *
     * @returns Object with count of deleted tokens
     */
    async deleteExpired(): Promise<{ count: number }> {
        return prisma.verificationToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }

}
