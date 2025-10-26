/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { ValidationResult } from './types';

/////////////////////////////
///  VALIDATION SECTION   ///
/////////////////////////////
/**
 * Password validation utilities
 * Enforces security requirements for passwords
 */
export class PasswordValidator {
    private static readonly MIN_LENGTH = 8;
    private static readonly MAX_LENGTH = 128;

    /**
     * Validates password meets all security requirements
     *
     * @param password - The password to validate
     * @returns Validation result with specific error message
     */
    static validate(password: string): ValidationResult {
        if (!password || password.length === 0) {
            return {
                valid: false,
                error: 'Password is required',
            };
        }

        if (password.length < this.MIN_LENGTH) {
            return {
                valid: false,
                error: `Password must be at least ${this.MIN_LENGTH} characters`,
            };
        }

        if (password.length > this.MAX_LENGTH) {
            return {
                valid: false,
                error: `Password must be no more than ${this.MAX_LENGTH} characters`,
            };
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return {
                valid: false,
                error: 'Password must contain at least one uppercase letter',
            };
        }

        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return {
                valid: false,
                error: 'Password must contain at least one lowercase letter',
            };
        }

        // Check for at least one number
        if (!/[0-9]/.test(password)) {
            return {
                valid: false,
                error: 'Password must contain at least one number',
            };
        }

        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return {
                valid: false,
                error: 'Password must contain at least one special character',
            };
        }

        return { valid: true };
    }

    /**
     * Validates password matches confirmation
     *
     * @param password - The original password
     * @param confirmation - The confirmation password
     * @returns Validation result with error message if passwords don't match
     */
    static matches(password: string, confirmation: string): ValidationResult {
        if (password !== confirmation) {
            return {
                valid: false,
                error: 'Passwords do not match',
            };
        }
        return { valid: true };
    }
}
