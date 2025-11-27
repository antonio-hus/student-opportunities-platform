/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/src/database";
import { Coordinator } from "@/src/domain/coordinator";


/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
/**
 * Repository for managing coordinator profiles and related data
 * Handles all database operations specific to coordinator (staff) accounts
 */
export class CoordinatorRepository {
    /**
     * Creates a new coordinator profile linked to an existing user
     *
     * @param data - Object containing the required coordinator fields
     * @param data.userId - The unique ID of the associated User record
     * @param data.department - Optional department name
     * @param data.title - Optional academic or professional title
     * @param data.areasOfExpertise - Optional array of expertise areas
     * @param data.contactEmail - Optional contact email
     * @param data.contactPhone - Optional contact phone
     * @param data.bio - Optional biography text
     * @returns The created Coordinator record with generated ID and timestamps
     */
    async create(data: {
        userId: string;
        department?: string;
        title?: string;
        areasOfExpertise?: string[];
        contactEmail?: string;
        contactPhone?: string;
        bio?: string;
    }): Promise<Coordinator> {
        return prisma.coordinator.create({
            data: {
                userId: data.userId,
                department: data.department,
                title: data.title,
                areasOfExpertise: data.areasOfExpertise || [],
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                bio: data.bio,
            }
        });
    }

    /**
     * Finds a coordinator by their unique ID
     *
     * @param id - The unique identifier (CUID) of the coordinator
     * @returns The Coordinator record or null if not found
     */
    async findById(id: string): Promise<Coordinator | null> {
        return prisma.coordinator.findUnique({ where: { id } });
    }

    /**
     * Finds a coordinator by their associated user ID
     *
     * @param userId - The unique identifier of the associated User
     * @returns The Coordinator record or null if not found
     */
    async findByUserId(userId: string): Promise<Coordinator | null> {
        return prisma.coordinator.findUnique({ where: { userId } });
    }

    /**
     * Retrieves all coordinators with optional filtering and pagination
     *
     * @param options - Optional query parameters
     * @param options.department - Filter by department
     * @param options.skip - Number of records to skip (pagination)
     * @param options.take - Number of records to retrieve (pagination)
     * @param options.includeUser - Whether to include related User data
     * @returns Array of Coordinator records matching the criteria
     */
    async findAll(options?: {
        department?: string;
        skip?: number;
        take?: number;
        includeUser?: boolean;
    }): Promise<Coordinator[]> {
        return prisma.coordinator.findMany({
            where: {
                department: options?.department,
            },
            skip: options?.skip,
            take: options?.take,
            include: options?.includeUser ? { user: true } : undefined,
        });
    }

    /**
     * Updates a coordinator's profile by their ID
     *
     * @param id - The unique identifier of the coordinator to update
     * @param data - Partial coordinator data containing only the fields to update
     * @returns The updated Coordinator record with new timestamps
     */
    async updateById(id: string, data: Partial<Coordinator>): Promise<Coordinator> {
        return prisma.coordinator.update({ where: { id }, data });
    }

    /**
     * Deletes a coordinator by their ID
     * Related user will be preserved due to onDelete: Cascade on userId
     *
     * @param id - The unique identifier of the coordinator to delete
     */
    async deleteById(id: string): Promise<void> {
        await prisma.coordinator.delete({ where: { id } });
    }

    /**
     * Gets total count of coordinators with optional filtering
     *
     * @param options - Optional filter parameters
     * @param options.department - Filter by department
     * @returns Total count of coordinators matching the criteria
     */
    async count(options?: {
        department?: string;
    }): Promise<number> {
        return prisma.coordinator.count({
            where: {
                department: options?.department,
            }
        });
    }
}
