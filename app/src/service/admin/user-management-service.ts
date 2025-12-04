/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { UserRepository } from "@/src/repository/user-repository";
import { UserRole, User } from "@/src/domain/user";
import { OrganizationType, Organization } from "@/src/domain/organization";
import { StudentRepository } from "@/src/repository/student-repository";
import { CoordinatorRepository } from "@/src/repository/coordinator-repository";
import { OrganizationRepository } from "@/src/repository/organization-repository";
import { AdminRepository } from "@/src/repository/admin-repository";
import { EmailService } from "@/src/service/email/email-service";

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Service for administrator user management and content moderation
 * Implements US-A1: User Management and US-A2: Content Moderation
 * Handles role-based user operations, verification, and moderation queues
 */
export class AdminUserManagementService {
    private userRepository: UserRepository;
    private studentRepository: StudentRepository;
    private coordinatorRepository: CoordinatorRepository;
    private organizationRepository: OrganizationRepository;
    private administratorRepository: AdminRepository;
    private emailService: EmailService;

    constructor() {
        this.userRepository = new UserRepository();
        this.studentRepository = new StudentRepository();
        this.coordinatorRepository = new CoordinatorRepository();
        this.organizationRepository = new OrganizationRepository();
        this.administratorRepository = new AdminRepository();
        this.emailService = new EmailService();
    }

    /**
     * Retrieves all users with their associated role profiles
     * Supports pagination and role filtering for admin dashboard
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
     * Gets detailed user information including role profile
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

    /**
     * Changes a user's role and creates appropriate profile
     * Handles migration between STUDENT, COORDINATOR, ORGANIZATION, ADMINISTRATOR roles
     */
    async changeUserRole(userId: string, newRole: UserRole): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Delete old role profile if exists
        await this.cleanupRoleProfile(user.role, userId);

        // Update user role
        const updatedUser = await this.userRepository.updateById(userId, { role: newRole });

        // Create new role profile (Organization is handled via promoteToOrganization usually)
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
        }

        return updatedUser;
    }

    /**
     * Specialized workflow to promote a user to an ORGANIZATION role.
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
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error("User not found");

        await this.cleanupRoleProfile(user.role, userId);

        const updatedUser = await this.userRepository.updateById(userId, {
            role: "ORGANIZATION"
        });

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
     */
    async deleteUser(userId: string): Promise<void> {
        await this.userRepository.deleteById(userId);
    }

    /**
     * Suspends a user account preventing login and platform access
     */
    async suspendUser(userId: string, reason: string = "Violation of terms of service"): Promise<User> {
        const updatedUser = await this.userRepository.updateById(userId, {
            isSuspended: true,
            isActive: false
        });

        if (updatedUser.email) {
            try {
                const recipientName = updatedUser.name || "User";
                await this.emailService.sendAccountSuspended(
                    updatedUser.email,
                    recipientName,
                    reason
                );
            } catch (error) {
                console.error(`[AdminService] Failed to send suspension email to ${updatedUser.email}`, error);
            }
        }

        return updatedUser;
    }

    /**
     * Reactivates a suspended user account restoring platform access
     */
    async reactivateUser(userId: string): Promise<User> {
        return this.userRepository.updateById(userId, {
            isSuspended: false,
            isActive: true
        });
    }

    /**
     * Retrieves all organizations pending verification
     */
    async getPendingOrganizationRegistrations(): Promise<Organization[]> {
        return this.organizationRepository.findAll({
            isVerified: false,
        });
    }

    /**
     * Approves an organization registration (Verify)
     */
    async verifyOrganization(organizationId: string, verifiedByAdminId: string): Promise<Organization> {
        const org = await this.organizationRepository.verifyOrganization(organizationId, verifiedByAdminId);

        // Send approval email
        const user = await this.userRepository.findById(org.userId);
        const recipientEmail = org.contactEmail || user?.email;

        if (recipientEmail) {
            await this.emailService.sendOrganizationApproved(
                recipientEmail,
                org.organizationName
            ).catch(console.error);
        }

        return org;
    }

    /**
     * Removes verification from an organization account
     */
    async unverifyOrganization(organizationId: string) {
        return this.organizationRepository.unverifyOrganization(organizationId);
    }

    /**
     * Rejects an organization registration
     */
    async rejectOrganizationRegistration(
        organizationId: string,
        reason: string,
        shouldSuspendUser: boolean = false
    ): Promise<void> {
        const org = await this.organizationRepository.findById(organizationId);
        if (!org) throw new Error("Organization not found");

        if (shouldSuspendUser) {
            await this.suspendUser(org.userId, reason);
        } else {
            const user = await this.userRepository.findById(org.userId);
            const recipientEmail = org.contactEmail || user?.email;

            if (recipientEmail) {
                await this.emailService.sendOrganizationRejected(
                    recipientEmail,
                    org.organizationName,
                    reason
                ).catch(console.error);
            }
        }

        await this.organizationRepository.deleteById(organizationId);
    }

    /**
     * Edits an organization's profile directly (Moderation)
     */
    async moderateOrganizationProfile(
        organizationId: string,
        sanitizedData: {
            description?: string;
            organizationName?: string;
            websiteUrl?: string;
        }
    ): Promise<Organization> {
        return this.organizationRepository.updateById(organizationId, sanitizedData);
    }

    /**
     * Cleanup profile by role
     * @param role
     * @param userId
     * @private
     */
    private async cleanupRoleProfile(role: UserRole, userId: string) {
        switch (role) {
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
    }
}
