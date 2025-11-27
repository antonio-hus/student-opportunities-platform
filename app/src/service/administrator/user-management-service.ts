/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { UserRepository } from "@/src/repository/user-repository";
import { UserRole, User } from "@/src/domain/user";
import { OrganizationType } from "@/src/domain/organization";
import { StudentRepository } from "@/src/repository/student-repository";
import { CoordinatorRepository } from "@/src/repository/coordinator-repository";
import { OrganizationRepository } from "@/src/repository/organization-repository";
import { AdministratorRepository } from "@/src/repository/administrator-repository";


/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Service for administrator user management operations
 * Implements US-A1: User Management functionality
 * Handles role-based user operations with verification and permission controls
 */
export class AdminUserManagementService {
    private userRepository: UserRepository;
    private studentRepository: StudentRepository;
    private coordinatorRepository: CoordinatorRepository;
    private organizationRepository: OrganizationRepository;
    private administratorRepository: AdministratorRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.studentRepository = new StudentRepository();
        this.coordinatorRepository = new CoordinatorRepository();
        this.organizationRepository = new OrganizationRepository();
        this.administratorRepository = new AdministratorRepository();
    }

    /**
     * Retrieves all users with their associated role profiles
     * Supports pagination and role filtering for admin dashboard
     *
     * @param options - Query parameters for filtering and pagination
     * @param options.role - Optional role filter (STUDENT, COORDINATOR, ORGANIZATION, ADMINISTRATOR)
     * @param options.isActive - Optional active status filter
     * @param options.isSuspended - Optional suspended status filter
     * @param options.skip - Number of records to skip (pagination)
     * @param options.take - Number of records to retrieve (pagination)
     * @returns Array of users with role-specific profile data included
     */
    async getAllUsers(options?: {
        role?: UserRole;
        isActive?: boolean;
        isSuspended?: boolean;
        skip?: number;
        take?: number;
    }) {
        const users = await this.userRepository.findAll();

        // Apply filters
        let filteredUsers = users;
        if (options?.role) {
            filteredUsers = filteredUsers.filter(u => u.role === options.role);
        }
        if (options?.isActive !== undefined) {
            filteredUsers = filteredUsers.filter(u => u.isActive === options.isActive);
        }
        if (options?.isSuspended !== undefined) {
            filteredUsers = filteredUsers.filter(u => u.isSuspended === options.isSuspended);
        }

        // Apply pagination
        const skip = options?.skip || 0;
        const take = options?.take || 50;
        const paginatedUsers = filteredUsers.slice(skip, skip + take);

        return {
            users: paginatedUsers,
            total: filteredUsers.length,
            hasMore: (skip + take) < filteredUsers.length
        };
    }

    /**
     * Suspends a user account preventing login and platform access
     * Used by administrators to enforce account restrictions
     *
     * @param userId - The unique identifier of the user to suspend
     * @returns The updated User record with isSuspended set to true
     */
    async suspendUser(userId: string): Promise<User> {
        return this.userRepository.updateById(userId, {
            isSuspended: true,
            isActive: false
        });
    }

    /**
     * Reactivates a suspended user account restoring platform access
     *
     * @param userId - The unique identifier of the user to reactivate
     * @returns The updated User record with isSuspended set to false and isActive to true
     */
    async reactivateUser(userId: string): Promise<User> {
        return this.userRepository.updateById(userId, {
            isSuspended: false,
            isActive: true
        });
    }

    /**
     * Verifies an organization account allowing them to post projects
     * Implements verification requirement from US-A1 and FR-ADMIN-1
     *
     * @param organizationId - The unique identifier of the organization profile
     * @param verifiedByAdminId - The administrator user ID performing the verification
     * @returns The updated Organization record with verification metadata
     */
    async verifyOrganization(organizationId: string, verifiedByAdminId: string) {
        return this.organizationRepository.verifyOrganization(organizationId, verifiedByAdminId);
    }

    /**
     * Removes verification from an organization account
     * Used when verification criteria are no longer met
     *
     * @param organizationId - The unique identifier of the organization profile
     * @returns The updated Organization record with verification removed
     */
    async unverifyOrganization(organizationId: string) {
        return this.organizationRepository.unverifyOrganization(organizationId);
    }

    /**
     * Changes a user's role and creates appropriate profile
     * Handles migration between STUDENT, COORDINATOR, ORGANIZATION, ADMINISTRATOR roles
     *
     * @param userId - The unique identifier of the user
     * @param newRole - The new role to assign
     * @returns The updated User record with new role
     */
    async changeUserRole(userId: string, newRole: UserRole): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Delete old role profile if exists
        switch (user.role) {
            case "STUDENT":
                const student = await this.studentRepository.findByUserId(userId);
                if (student) await this.studentRepository.deleteById(student.id);
                break;
            case "COORDINATOR":
                const coordinator = await this.coordinatorRepository.findByUserId(userId);
                if (coordinator) await this.coordinatorRepository.deleteById(coordinator.id);
                break;
            case "ORGANIZATION":
                const organization = await this.organizationRepository.findByUserId(userId);
                if (organization) await this.organizationRepository.deleteById(organization.id);
                break;
            case "ADMINISTRATOR":
                const administrator = await this.administratorRepository.findByUserId(userId);
                if (administrator) await this.administratorRepository.deleteById(administrator.id);
                break;
        }

        // Update user role
        const updatedUser = await this.userRepository.updateById(userId, { role: newRole });

        // Create new role profile
        switch (newRole) {
            case "STUDENT":
                await this.studentRepository.create({ userId });
                break;
            case "COORDINATOR":
                await this.coordinatorRepository.create({ userId });
                break;
            case "ADMINISTRATOR":
                await this.administratorRepository.create({ userId });
                break;
            // ORGANIZATION requires additional data, handled separately
        }

        return updatedUser;
    }

    /**
     * Specialized workflow to promote a user to an ORGANIZATION role.
     * This is required because Organizations need mandatory profile data (name, type)
     * that cannot be inferred in the generic changeUserRole method.
     *
     * @param userId - The unique identifier of the user to promote
     * @param orgData - The mandatory and optional data for the organization profile
     * @returns The updated User record
     */
    async promoteToOrganization(
        userId: string,
        orgData: {
            organizationName: string;
            type: OrganizationType;
            description?: string;
            contactPerson?: string;
            contactEmail?: string;
            websiteUrl?: string;
            city?: string;
        }
    ): Promise<User> {
        // Verify user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Clean up any existing role profiles (same logic as changeUserRole)
        // We must remove old profiles to maintain 1:1 integrity if they are switching roles
        if (user.role === "STUDENT") {
            const student = await this.studentRepository.findByUserId(userId);
            if (student) await this.studentRepository.deleteById(student.id);
        } else if (user.role === "COORDINATOR") {
            const coordinator = await this.coordinatorRepository.findByUserId(userId);
            if (coordinator) await this.coordinatorRepository.deleteById(coordinator.id);
        } else if (user.role === "ADMINISTRATOR") {
            const admin = await this.administratorRepository.findByUserId(userId);
            if (admin) await this.administratorRepository.deleteById(admin.id);
        }

        // Update the user's role in the main User table
        const updatedUser = await this.userRepository.updateById(userId, {
            role: "ORGANIZATION"
        });

        // Create the specific Organization profile with the required data
        await this.organizationRepository.create({
            userId: userId,
            organizationName: orgData.organizationName,
            type: orgData.type,
            description: orgData.description,
            contactPerson: orgData.contactPerson,
            contactEmail: orgData.contactEmail || user.email,
            websiteUrl: orgData.websiteUrl,
            city: orgData.city
        });

        return updatedUser;
    }

    /**
     * Permanently deletes a user and all associated data
     * Cascade deletes role profile, applications, and related records per schema
     *
     * @param userId - The unique identifier of the user to delete
     */
    async deleteUser(userId: string): Promise<void> {
        await this.userRepository.deleteById(userId);
    }

    /**
     * Gets detailed user information including role profile
     * Used for admin user detail views
     *
     * @param userId - The unique identifier of the user
     * @returns User object with role-specific profile data
     */
    async getUserDetails(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }

        let roleProfile = null;
        switch (user.role) {
            case "STUDENT":
                roleProfile = await this.studentRepository.findByUserId(userId);
                break;
            case "COORDINATOR":
                roleProfile = await this.coordinatorRepository.findByUserId(userId);
                break;
            case "ORGANIZATION":
                roleProfile = await this.organizationRepository.findByUserId(userId);
                break;
            case "ADMINISTRATOR":
                roleProfile = await this.administratorRepository.findByUserId(userId);
                break;
        }

        return {
            ...user,
            roleProfile
        };
    }
}
