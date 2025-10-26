/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { ValidationResult } from './types';

/////////////////////////////
///  VALIDATION SECTION   ///
/////////////////////////////
/**
 * Email validation utilities
 */
export class EmailValidator {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Validates email format
     *
     * @param email - The email address to validate
     * @returns Validation result with error message if invalid
     */
    static isValid(email: string): ValidationResult {
        if (!email || email.trim().length === 0) {
            return {
                valid: false,
                error: 'Email is required',
            };
        }

        if (!this.EMAIL_REGEX.test(email)) {
            return {
                valid: false,
                error: 'Invalid email format',
            };
        }

        return { valid: true };
    }

    /**
     * Validates email domain matches expected domain
     *
     * @param email - The email address to validate
     * @param allowedDomain - The required domain (e.g., 'university.edu')
     * @returns Validation result with error message if invalid
     */
    static hasDomain(email: string, allowedDomain: string): ValidationResult {
        const domain = email.split('@')[1];

        if (domain !== allowedDomain) {
            return {
                valid: false,
                error: `Email must be from ${allowedDomain} domain`,
            };
        }

        return { valid: true };
    }

    /**
     * Extracts domain from email address
     *
     * @param email - The email address
     * @returns The domain part of the email
     */
    static extractDomain(email: string): string {
        return email.split('@')[1] || '';
    }
}
