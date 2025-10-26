/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
/**
 * Standard validation result structure
 * Used across all validation functions for consistency
 */
export type ValidationResult = {
    valid: boolean;
    error?: string;
};

/**
 * Field-level validation result with field name
 */
export type FieldValidationResult = {
    field: string;
    valid: boolean;
    error?: string;
};

/**
 * Multi-field validation result for forms
 */
export type FormValidationResult = {
    valid: boolean;
    errors: Record<string, string>;
};
