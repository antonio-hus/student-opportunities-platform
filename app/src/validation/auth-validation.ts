/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { UserRole } from '@/src/domain/user';
import { FormValidationResult } from './types';
import { StringValidator } from './string-validation';
import { EmailValidator } from './email-validation';
import { PasswordValidator } from './password-validation';
import { FormValidator } from './form-validation';

/////////////////////////////
///  VALIDATION SECTION   ///
/////////////////////////////
/**
 * Authentication form validation functions
 * Contains inline types and validation logic for all auth operations
 */
export class AuthValidator {
    /**
     * Validates sign up form data
     *
     * @param data - Sign up form data with name, email, password, and role
     * @returns Form validation result with field-specific errors
     */
    static validateSignUp(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }): FormValidationResult {
        const validations = [];

        // Validate name
        const nameRequired = StringValidator.required(data.name, 'Name');
        if (!nameRequired.valid) {
            validations.push(FormValidator.field('name', false, nameRequired.error));
        } else {
            const nameLength = StringValidator.minLength(data.name, 2, 'Name');
            validations.push(FormValidator.field('name', nameLength.valid, nameLength.error));
        }

        // Validate email
        const emailValidation = EmailValidator.isValid(data.email);
        validations.push(FormValidator.field('email', emailValidation.valid, emailValidation.error));

        // Validate password
        const passwordValidation = PasswordValidator.validate(data.password);
        validations.push(FormValidator.field('password', passwordValidation.valid, passwordValidation.error));

        return FormValidator.combine(validations);
    }

    /**
     * Validates sign in form data
     *
     * @param data - Sign in form data with email and password
     * @returns Form validation result with field-specific errors
     */
    static validateSignIn(data: {
        email: string;
        password: string;
    }): FormValidationResult {
        const validations = [];

        // Validate email
        const emailValidation = EmailValidator.isValid(data.email);
        validations.push(FormValidator.field('email', emailValidation.valid, emailValidation.error));

        // Validate password present
        const passwordRequired = StringValidator.required(data.password, 'Password');
        validations.push(FormValidator.field('password', passwordRequired.valid, passwordRequired.error));

        return FormValidator.combine(validations);
    }

    /**
     * Validates password reset request form data
     *
     * @param data - Password reset request data with email
     * @returns Form validation result with field-specific errors
     */
    static validatePasswordResetRequest(data: {
        email: string;
    }): FormValidationResult {
        const validations = [];

        // Validate email
        const emailValidation = EmailValidator.isValid(data.email);
        validations.push(FormValidator.field('email', emailValidation.valid, emailValidation.error));

        return FormValidator.combine(validations);
    }

    /**
     * Validates password reset form data
     *
     * @param data - Password reset form data with token and new password
     * @returns Form validation result with field-specific errors
     */
    static validatePasswordReset(data: {
        token: string;
        password: string;
    }): FormValidationResult {
        const validations = [];

        // Validate token
        const tokenRequired = StringValidator.required(data.token, 'Token');
        validations.push(FormValidator.field('token', tokenRequired.valid, tokenRequired.error));

        // Validate new password
        const passwordValidation = PasswordValidator.validate(data.password);
        validations.push(FormValidator.field('password', passwordValidation.valid, passwordValidation.error));

        return FormValidator.combine(validations);
    }

    /**
     * Validates change password form data
     *
     * @param data - Change password form data with current and new password
     * @returns Form validation result with field-specific errors
     */
    static validateChangePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): FormValidationResult {
        const validations = [];

        // Validate current password
        const currentPasswordRequired = StringValidator.required(data.currentPassword, 'Current password');
        validations.push(FormValidator.field('currentPassword', currentPasswordRequired.valid, currentPasswordRequired.error));

        // Validate new password
        const newPasswordValidation = PasswordValidator.validate(data.newPassword);
        validations.push(FormValidator.field('newPassword', newPasswordValidation.valid, newPasswordValidation.error));

        return FormValidator.combine(validations);
    }

    /**
     * Validates resend verification email request
     *
     * @param data - Resend verification data with email
     * @returns Form validation result with field-specific errors
     */
    static validateResendVerification(data: {
        email: string;
    }): FormValidationResult {
        const validations = [];

        // Validate email
        const emailValidation = EmailValidator.isValid(data.email);
        validations.push(FormValidator.field('email', emailValidation.valid, emailValidation.error));

        return FormValidator.combine(validations);
    }
}
