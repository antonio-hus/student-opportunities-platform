/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { UserRole } from '@/src/domain/user';
import { VerificationTokenService } from '@/src/service/verification-token-service';
import { PasswordResetTokenService } from '@/src/service/password-reset-token-service';
import { AuthValidator } from '@/src/validation/auth-validation';
import { hashPassword, verifyPassword } from '@/src/utils/password-hash';
import { UserService } from "@/src/service/user-service";

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Authentication Service
 * Handles all authentication-related business logic including registration,
 * login, email verification, password reset, and account management
 */
export class AuthService {
    private userService: UserService;
    private verificationTokenService: VerificationTokenService;
    private passwordResetTokenService: PasswordResetTokenService;

    constructor() {
        this.userService = new UserService();
        this.verificationTokenService = new VerificationTokenService();
        this.passwordResetTokenService = new PasswordResetTokenService();
    }

    /**
     * Register a new user with email and password
     *
     * @param data - Sign up form data containing name, email, password, and role
     * @returns User record and verification token for email confirmation
     * @throws Error with translation key if validation or registration fails
     */
    async signUp(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }) {
        // Validate input data
        const validation = AuthValidator.validateSignUp(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            throw new Error(firstError || 'validation.invalidInput');
        }

        // Check if email already exists
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
            throw new Error('auth.emailAlreadyExists');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await this.userService.create({
            email: data.email,
            hashedPassword,
            role: data.role,
            name: data.name,
        });

        // Generate and store verification token
        const verificationToken = await this.verificationTokenService.createToken(user.id);

        return { user, verificationToken };
    }

    /**
     * Authenticate user with email and password
     *
     * @param data - Sign in credentials with email and password
     * @returns Authenticated user record
     * @throws Error with translation key if authentication fails
     */
    async signIn(data: {
        email: string;
        password: string;
    }) {
        // Validate input data
        const validation = AuthValidator.validateSignIn(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            throw new Error(firstError || 'validation.invalidInput');
        }

        // Find user by email
        const user = await this.userService.findByEmail(data.email);
        if (!user || !user.hashedPassword) {
            throw new Error('auth.invalidCredentials');
        }

        // Verify password
        const isValidPassword = await verifyPassword(data.password, user.hashedPassword);
        if (!isValidPassword) {
            throw new Error('auth.invalidCredentials');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new Error('auth.accountDeactivated');
        }

        // Check if account is suspended
        if (user.isSuspended) {
            throw new Error('auth.accountSuspended');
        }

        // Update last login timestamp
        await this.userService.updateById(user.id, {
            lastLoginAt: new Date(),
        });

        return user;
    }

    /**
     * Verify user email with verification token
     *
     * @param token - Email verification token from the verification link
     * @returns Verification result with success status and user ID
     */
    async verifyEmail(token: string) {
        const verificationTokenService = new VerificationTokenService();

        // Verify the token
        const result = await verificationTokenService.verifyToken(token);

        if (!result.valid || !result.userId) {
            return { valid: false, error: result.error };
        }

        // Mark email as verified with current timestamp
        await this.userService.markEmailAsVerified(result.userId, new Date());

        // Delete the used token
        await verificationTokenService.deleteToken(token);

        return { valid: true };
    }

    /**
     * Request password reset for a user
     * Returns null if user doesn't exist (security: don't reveal user existence)
     *
     * @param data - Password reset request with email address
     * @returns Password reset token and user, or null if user doesn't exist
     */
    async requestPasswordReset(data: {
        email: string;
    }) {
        // Validate input data
        const validation = AuthValidator.validatePasswordResetRequest(data);
        if (!validation.valid) {
            // Don't reveal validation errors for security
            return null;
        }

        const user = await this.userService.findByEmail(data.email);

        // Return null if user doesn't exist (don't reveal existence)
        if (!user) {
            return null;
        }

        // Generate and store password reset token
        const token = await this.passwordResetTokenService.createToken(user.id);

        return { token, user };
    }

    /**
     * Reset user password with reset token
     *
     * @param data - Password reset data with token and new password
     * @returns Verification result indicating success or error
     */
    async resetPassword(data: {
        token: string;
        password: string;
    }) {
        // Validate input data
        const validation = AuthValidator.validatePasswordReset(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return {
                valid: false,
                error: firstError || 'validation.invalidInput',
            };
        }

        const result = await this.passwordResetTokenService.verifyToken(data.token);

        if (!result.valid) {
            return result;
        }

        // Hash new password
        const hashedPassword = await hashPassword(data.password);

        // Update user password
        await this.userService.updateById(result.userId!, {
            hashedPassword,
        });

        // Delete used token
        await this.passwordResetTokenService.deleteToken(data.token);

        return result;
    }

    /**
     * Verify password reset token validity without resetting password
     *
     * @param token - Password reset token to verify
     * @returns Verification result indicating if token is valid and not expired
     */
    async verifyPasswordResetToken(token: string) {
        return await this.passwordResetTokenService.verifyToken(token);
    }

    /**
     * Resend verification email for unauthenticated user
     * Returns null if user doesn't exist or is already verified (security measure)
     *
     * @param data - Resend verification request with email address
     * @returns User record and new verification token, or null
     */
    async resendVerificationEmail(data: {
        email: string;
    }) {
        // Validate input
        const validation = AuthValidator.validateResendVerification(data);
        if (!validation.valid) {
            // Don't reveal validation errors for security
            return null;
        }

        const user = await this.userService.findByEmail(data.email);

        // Return null if user doesn't exist (don't reveal existence)
        if (!user) {
            return null;
        }

        // Return null if already verified
        if (user.emailVerified) {
            return null;
        }

        // Generate and store new verification token
        const verificationToken = await this.verificationTokenService.createToken(user.id);

        return { user, verificationToken };
    }

    /**
     * Resend verification email for authenticated user
     *
     * @param userId - ID of the authenticated user requesting new verification email
     * @returns User record and new verification token
     * @throws Error if user not found or already verified
     */
    async resendVerificationEmailAuthenticated(userId: string) {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new Error('auth.userNotFound');
        }

        if (user.emailVerified) {
            throw new Error('auth.alreadyVerified');
        }

        // Generate and store new verification token
        const verificationToken = await this.verificationTokenService.createToken(user.id);

        return { user, verificationToken };
    }

    /**
     * Change password for authenticated user
     *
     * @param userId - ID of the authenticated user
     * @param data - Current password and new password
     * @throws Error if current password is invalid or validation fails
     */
    async changePassword(
        userId: string,
        data: {
            currentPassword: string;
            newPassword: string;
        }
    ): Promise<void> {
        // Validate input data
        const validation = AuthValidator.validateChangePassword(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            throw new Error(firstError || 'validation.invalidInput');
        }

        const user = await this.userService.findById(userId);

        if (!user || !user.hashedPassword) {
            throw new Error('auth.userNotFound');
        }

        // Verify current password
        const isValidPassword = await verifyPassword(data.currentPassword, user.hashedPassword);
        if (!isValidPassword) {
            throw new Error('auth.invalidPassword');
        }

        // Check if new password is same as current
        const isSamePassword = await verifyPassword(data.newPassword, user.hashedPassword);
        if (isSamePassword) {
            throw new Error('auth.samePassword');
        }

        // Hash and update password
        const hashedPassword = await hashPassword(data.newPassword);
        await this.userService.updateById(userId, {
            hashedPassword,
        });
    }

    /**
     * Deactivate user account (soft delete)
     *
     * @param userId - ID of the user to deactivate
     * @throws Error if user not found
     */
    async deactivateAccount(userId: string): Promise<void> {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new Error('auth.userNotFound');
        }

        await this.userService.updateById(userId, {
            isActive: false,
        });
    }

    /**
     * Reactivate previously deactivated user account
     *
     * @param userId - ID of the user to reactivate
     * @throws Error if user not found
     */
    async reactivateAccount(userId: string): Promise<void> {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new Error('auth.userNotFound');
        }

        await this.userService.updateById(userId, {
            isActive: true,
        });
    }
}