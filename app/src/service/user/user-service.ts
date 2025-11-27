/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { UserRepository } from '@/src/repository/user-repository';
import { User, UserRole } from '@/src/domain/user';

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * User Service
 * Handles user-related business logic and operations
 * Provides CRUD operations and user management functionality
 */
export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Creates a new user
     *
     * @param data - User data for creation
     * @returns Created user object
     */
    async create(data: {
        email: string;
        hashedPassword: string;
        role: UserRole;
        name?: string;
    }): Promise<User> {
        return await this.userRepository.create(data);
    }

    /**
     * Gets a user by ID
     *
     * @param userId - User ID to fetch
     * @returns User object or null if not found
     */
    async findById(userId: string): Promise<User | null> {
        return await this.userRepository.findById(userId);
    }

    /**
     * Gets a user by email
     *
     * @param email - User email to find
     * @returns User object or null if not found
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email);
    }

    /**
     * Updates a user by ID
     *
     * @param userId - User ID to update
     * @param data - Partial user data to update
     * @returns Updated user object
     */
    async updateById(userId: string, data: Partial<User>): Promise<User> {
        return await this.userRepository.updateById(userId, data);
    }

    /**
     * Deletes a user by ID (hard delete)
     * Use deactivateUser for soft delete
     *
     * @param userId - User ID to delete
     */
    async deleteById(userId: string): Promise<void> {
        await this.userRepository.deleteById(userId);
    }

    /**
     * Gets email verification status for a user
     * Returns the date when email was verified, or null if not verified
     *
     * @param userId - User ID to check
     * @returns Date when email was verified, or null if not verified
     */
    async getEmailVerificationStatus(userId: string): Promise<Date | null> {
        return await this.userRepository.getEmailVerificationStatus(userId);
    }

    /**
     * Checks if a user's email is verified
     * Convenience method that returns boolean
     *
     * @param userId - User ID to check
     * @returns True if email is verified, false otherwise
     */
    async isEmailVerified(userId: string): Promise<boolean> {
        const verifiedDate = await this.userRepository.getEmailVerificationStatus(userId);
        return verifiedDate !== null;
    }

    /**
     * Marks user's email as verified with the provided timestamp
     * Sets the emailVerified field to the given date
     *
     * @param userId - User ID to verify
     * @param verifiedAt - Date when email was verified (defaults to now)
     * @returns Updated user object
     */
    async markEmailAsVerified(userId: string, verifiedAt: Date = new Date()): Promise<User> {
        return await this.userRepository.updateById(userId, {
            emailVerified: verifiedAt,
        });
    }

    /**
     * Activates a user account
     * Sets isActive to true
     *
     * @param userId - User ID to activate
     * @returns Updated user object
     */
    async activateUser(userId: string): Promise<User> {
        return await this.userRepository.updateById(userId, {
            isActive: true,
        });
    }

    /**
     * Deactivates a user account (soft delete)
     * Sets isActive to false
     *
     * @param userId - User ID to deactivate
     * @returns Updated user object
     */
    async deactivateUser(userId: string): Promise<User> {
        return await this.userRepository.updateById(userId, {
            isActive: false,
        });
    }

    /**
     * Suspends a user account
     * Sets isSuspended to true
     *
     * @param userId - User ID to suspend
     * @returns Updated user object
     */
    async suspendUser(userId: string): Promise<User> {
        return await this.userRepository.updateById(userId, {
            isSuspended: true,
        });
    }

    /**
     * Unsuspends a user account
     * Sets isSuspended to false
     *
     * @param userId - User ID to unsuspend
     * @returns Updated user object
     */
    async unsuspendUser(userId: string): Promise<User> {
        return await this.userRepository.updateById(userId, {
            isSuspended: false,
        });
    }
}
