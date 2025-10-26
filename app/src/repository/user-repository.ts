/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/src/database";
import { User, UserRole } from "@prisma/client";

/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
/**
 * Repository for managing user data and authentication
 * Handles all database operations related to users across all roles
 */
export class UserRepository {
    /**
     * Creates a new user record in the database
     *
     * @param data - Object containing the required user fields
     * @param data.email - The unique email address for the user
     * @param data.role - The user's role (STUDENT, COORDINATOR, ORGANIZATION, ADMINISTRATOR)
     * @param data.hashedPassword - Optional bcrypt hashed password for authentication
     * @param data.name - Optional display name for the user
     * @param data.profilePictureUrl - Optional URL to the user's profile picture
     * @returns The created User record with generated ID and timestamps
     */
    async create(data: {
        email: string;
        role: UserRole;
        hashedPassword?: string;
        name?: string;
        profilePictureUrl?: string;
    }): Promise<User> {
        return prisma.user.create({data: {
                email: data.email,
                role: data.role,
                hashedPassword: data.hashedPassword,
                name: data.name,
                profilePictureUrl: data.profilePictureUrl,
            }});
    }

    /**
     * Finds a user by their unique ID
     *
     * @param id - The unique identifier (CUID) of the user
     * @returns The User record or null if not found
     */
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    /**
     * Finds a user by their email address
     *
     * @param email - The email address to search for (case-sensitive unique field)
     * @returns The User record or null if not found
     */
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    /**
     * Updates a user's information by their ID
     *
     * @param id - The unique identifier of the user to update
     * @param data - Partial user data containing only the fields to update
     * @returns The updated User record with new timestamps
     */
    async updateById(id: string, data: Partial<User>): Promise<User> {
        return prisma.user.update({ where: { id }, data });
    }

    /**
     * Deletes a user by their ID
     * Cascade deletes related records (student, coordinator, organization, administrator profiles)
     * as defined in the Prisma schema
     *
     * @param id - The unique identifier of the user to delete
     */
    async deleteById(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
    }

    /**
     * Retrieves all users from the database
     * Note: For large datasets, consider implementing pagination
     *
     * @returns Array of all User records in the system
     */
    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    /**
     * Gets only the email verification status for a user
     * Used by SessionService to check verification during authentication
     *
     * @param userId - The unique identifier of the user
     * @returns The emailVerified timestamp (Date) if verified, null if not verified or user not found
     */
    async getEmailVerificationStatus(userId: string): Promise<Date | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { emailVerified: true }
        });
        return user?.emailVerified || null;
    }
}
