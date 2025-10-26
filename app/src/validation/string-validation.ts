/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { ValidationResult } from './types';

/////////////////////////////
///  VALIDATION SECTION   ///
/////////////////////////////
/**
 * String validation utilities
 * Provides common string validation functions
 */
export class StringValidator {
    /**
     * Validates minimum string length
     *
     * @param value - The string to validate
     * @param minLength - Minimum required length
     * @param fieldName - Name of the field for error messages
     * @returns Validation result with error message if invalid
     */
    static minLength(value: string, minLength: number, fieldName: string = 'Field'): ValidationResult {
        if (value.length < minLength) {
            return {
                valid: false,
                error: `${fieldName} must be at least ${minLength} characters`,
            };
        }
        return { valid: true };
    }

    /**
     * Validates maximum string length
     *
     * @param value - The string to validate
     * @param maxLength - Maximum allowed length
     * @param fieldName - Name of the field for error messages
     * @returns Validation result with error message if invalid
     */
    static maxLength(value: string, maxLength: number, fieldName: string = 'Field'): ValidationResult {
        if (value.length > maxLength) {
            return {
                valid: false,
                error: `${fieldName} must be no more than ${maxLength} characters`,
            };
        }
        return { valid: true };
    }

    /**
     * Validates that string is not empty
     *
     * @param value - The string to validate
     * @param fieldName - Name of the field for error messages
     * @returns Validation result with error message if invalid
     */
    static required(value: string | undefined | null, fieldName: string = 'Field'): ValidationResult {
        if (!value || value.trim().length === 0) {
            return {
                valid: false,
                error: `${fieldName} is required`,
            };
        }
        return { valid: true };
    }

    /**
     * Validates string matches a regex pattern
     *
     * @param value - The string to validate
     * @param pattern - Regular expression pattern
     * @param errorMessage - Custom error message
     * @returns Validation result with error message if invalid
     */
    static pattern(value: string, pattern: RegExp, errorMessage: string): ValidationResult {
        if (!pattern.test(value)) {
            return {
                valid: false,
                error: errorMessage,
            };
        }
        return { valid: true };
    }
}
