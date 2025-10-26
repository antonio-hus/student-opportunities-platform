/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { FormValidationResult, FieldValidationResult } from './types';

/////////////////////////////
///  VALIDATION SECTION   ///
/////////////////////////////
/**
 * Form validation utilities
 * Combines multiple field validations into a single result
 */
export class FormValidator {
    /**
     * Validates multiple fields and combines results
     *
     * @param validations - Array of field validation results
     * @returns Combined form validation result with all errors
     */
    static combine(validations: FieldValidationResult[]): FormValidationResult {
        const errors: Record<string, string> = {};
        let valid = true;

        for (const validation of validations) {
            if (!validation.valid && validation.error) {
                errors[validation.field] = validation.error;
                valid = false;
            }
        }

        return { valid, errors };
    }

    /**
     * Creates a field validation result
     *
     * @param field - Name of the field
     * @param valid - Whether the field is valid
     * @param error - Optional error message
     * @returns Field validation result
     */
    static field(field: string, valid: boolean, error?: string): FieldValidationResult {
        return { field, valid, error };
    }
}
