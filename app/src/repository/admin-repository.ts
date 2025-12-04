/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/src/database";
import { Administrator } from "@/src/domain/admin";


/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
/**
 * Repository for managing administrator profiles and related data
 * Handles all database operations specific to administrator accounts
 */
export class AdminRepository {
    /**
     * Creates a new administrator profile linked to an existing user
     *
     * @param data - Object containing the required administrator fields
     * @param data.userId - The unique ID of the associated User record
     * @param data.department - Optional department name
     * @param data.permissions - Optional array of permission identifiers
     * @returns The created Administrator record with generated ID and timestamps
     */
    async create(data: {
        userId: string;
        department?: string;
        permissions?: string[];
    }): Promise<Administrator> {
        return prisma.administrator.create({
            data: {
                userId: data.userId,
                department: data.department,
                permissions: data.permissions || [],
            }
        });
    }

    /**
     * Finds an administrator by their unique ID
     *
     * @param id - The unique identifier (CUID) of the administrator
     * @returns The Administrator record or null if not found
     */
    async findById(id: string): Promise<Administrator | null> {
        return prisma.administrator.findUnique({ where: { id } });
    }

    /**
     * Finds an administrator by their associated user ID
     *
     * @param userId - The unique identifier of the associated User
     * @returns The Administrator record or null if not found
     */
    async findByUserId(userId: string): Promise<Administrator | null> {
        return prisma.administrator.findUnique({ where: { userId } });
    }

    /**
     * Retrieves all administrators with optional filtering and pagination
     *
     * @param options - Optional query parameters
     * @param options.department - Filter by department
     * @param options.skip - Number of records to skip (pagination)
     * @param options.take - Number of records to retrieve (pagination)
     * @param options.includeUser - Whether to include related User data
     * @returns Array of Administrator records matching the criteria
     */
    async findAll(options?: {
        department?: string;
        skip?: number;
        take?: number;
        includeUser?: boolean;
    }): Promise<Administrator[]> {
        return prisma.administrator.findMany({
            where: {
                department: options?.department,
            },
            skip: options?.skip,
            take: options?.take,
            include: options?.includeUser ? { user: true } : undefined,
        });
    }

    /**
     * Updates an administrator's profile by their ID
     *
     * @param id - The unique identifier of the administrator to update
     * @param data - Partial administrator data containing only the fields to update
     * @returns The updated Administrator record with new timestamps
     */
    async updateById(id: string, data: Partial<Administrator>): Promise<Administrator> {
        return prisma.administrator.update({ where: { id }, data });
    }

    /**
     * Deletes an administrator by their ID
     * Related user will be preserved due to onDelete: Cascade on userId
     *
     * @param id - The unique identifier of the administrator to delete
     */
    async deleteById(id: string): Promise<void> {
        await prisma.administrator.delete({ where: { id } });
    }

    /**
     * Gets total count of administrators with optional filtering
     *
     * @param options - Optional filter parameters
     * @param options.department - Filter by department
     * @returns Total count of administrators matching the criteria
     */
    async count(options?: {
        department?: string;
    }): Promise<number> {
        return prisma.administrator.count({
            where: {
                department: options?.department,
            }
        });
    }
}