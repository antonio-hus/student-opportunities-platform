/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from "@/src/database";
import { Organization } from "@/src/domain/organization";


/////////////////////////////
///  REPOSITORY SECTION   ///
/////////////////////////////
/**
 * Repository for managing organization profiles and related data
 * Handles all database operations specific to organization accounts
 */
export class OrganizationRepository {
    /**
     * Creates a new organization profile linked to an existing user
     *
     * @param data - Object containing the required organization fields
     * @param data.userId - The unique ID of the associated User record
     * @param data.organizationName - The official name of the organization
     * @param data.type - The type of organization (NGO, SMALL_BUSINESS, etc.)
     * @param data.description - Optional detailed description
     * @param data.contactPerson - Optional contact person name
     * @param data.contactEmail - Optional contact email
     * @param data.contactPhone - Optional contact phone
     * @param data.websiteUrl - Optional website URL
     * @param data.facebookUrl - Optional Facebook page URL
     * @param data.address - Optional physical address
     * @param data.city - Optional city location
     * @param data.country - Optional country (defaults to "Romania")
     * @returns The created Organization record with generated ID and timestamps
     */
    async create(data: {
        userId: string;
        organizationName: string;
        type: string;
        description?: string;
        contactPerson?: string;
        contactEmail?: string;
        contactPhone?: string;
        websiteUrl?: string;
        facebookUrl?: string;
        address?: string;
        city?: string;
        country?: string;
    }): Promise<Organization> {
        return prisma.organization.create({
            data: {
                userId: data.userId,
                organizationName: data.organizationName,
                type: data.type as any,
                description: data.description,
                contactPerson: data.contactPerson,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                websiteUrl: data.websiteUrl,
                facebookUrl: data.facebookUrl,
                address: data.address,
                city: data.city,
                country: data.country || "Romania",
            }
        });
    }

    /**
     * Finds an organization by their unique ID
     *
     * @param id - The unique identifier (CUID) of the organization
     * @returns The Organization record or null if not found
     */
    async findById(id: string): Promise<Organization | null> {
        return prisma.organization.findUnique({ where: { id } });
    }

    /**
     * Finds an organization by their associated user ID
     *
     * @param userId - The unique identifier of the associated User
     * @returns The Organization record or null if not found
     */
    async findByUserId(userId: string): Promise<Organization | null> {
        return prisma.organization.findUnique({ where: { userId } });
    }

    /**
     * Retrieves all organizations with optional filtering and pagination
     *
     * @param options - Optional query parameters
     * @param options.type - Filter by organization type
     * @param options.isVerified - Filter by verification status
     * @param options.city - Filter by city
     * @param options.skip - Number of records to skip (pagination)
     * @param options.take - Number of records to retrieve (pagination)
     * @param options.includeUser - Whether to include related User data
     * @returns Array of Organization records matching the criteria
     */
    async findAll(options?: {
        type?: string;
        isVerified?: boolean;
        city?: string;
        skip?: number;
        take?: number;
        includeUser?: boolean;
    }): Promise<Organization[]> {
        return prisma.organization.findMany({
            where: {
                type: options?.type as any,
                isVerified: options?.isVerified,
                city: options?.city,
            },
            skip: options?.skip,
            take: options?.take,
            include: options?.includeUser ? { user: true } : undefined,
        });
    }

    /**
     * Updates an organization's profile by their ID
     *
     * @param id - The unique identifier of the organization to update
     * @param data - Partial organization data containing only the fields to update
     * @returns The updated Organization record with new timestamps
     */
    async updateById(id: string, data: Partial<Organization>): Promise<Organization> {
        return prisma.organization.update({ where: { id }, data });
    }

    /**
     * Verifies an organization account
     * Sets isVerified to true and records verification timestamp and admin ID
     *
     * @param id - The unique identifier of the organization to verify
     * @param verifiedBy - The admin user ID who performed the verification
     * @returns The updated Organization record with verification data
     */
    async verifyOrganization(id: string, verifiedBy: string): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data: {
                isVerified: true,
                verifiedAt: new Date(),
                verifiedBy: verifiedBy,
            }
        });
    }

    /**
     * Unverifies an organization account
     * Sets isVerified to false and clears verification metadata
     *
     * @param id - The unique identifier of the organization to unverify
     * @returns The updated Organization record
     */
    async unverifyOrganization(id: string): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data: {
                isVerified: false,
                verifiedAt: null,
                verifiedBy: null,
            }
        });
    }

    /**
     * Deletes an organization by their ID
     * Related user will be preserved due to onDelete: Cascade on userId
     *
     * @param id - The unique identifier of the organization to delete
     */
    async deleteById(id: string): Promise<void> {
        await prisma.organization.delete({ where: { id } });
    }

    /**
     * Gets total count of organizations with optional filtering
     *
     * @param options - Optional filter parameters
     * @param options.type - Filter by organization type
     * @param options.isVerified - Filter by verification status
     * @param options.city - Filter by city
     * @returns Total count of organizations matching the criteria
     */
    async count(options?: {
        type?: string;
        isVerified?: boolean;
        city?: string;
    }): Promise<number> {
        return prisma.organization.count({
            where: {
                type: options?.type as any,
                isVerified: options?.isVerified,
                city: options?.city,
            }
        });
    }
}
