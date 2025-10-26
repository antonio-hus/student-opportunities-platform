"use server"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { redirect } from "next/navigation";
// Project Libraries
import { AuthService } from "@/src/service/auth-service";
import { EmailService } from "@/src/service/email-service";
import { RateLimitService } from "@/src/service/rate-limit-service";
import { SessionService } from "@/src/service/session-service";
import { AuthValidator } from "@/src/validation/auth-validation";
import { getTranslations } from "@/src/utils/i18n/server";
import { getClientIp } from "@/src/utils/ip";


/////////////////////////////
///   CONTROLLER LAYER    ///
/////////////////////////////
/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 * Orchestrates services, validation, rate limiting, and error handling
 */

/**
 * Sign up a new user
 * Handles form validation, rate limiting, user registration, and session creation
 *
 * @param formData - Form data from signup form containing name, email, password, and role
 * @returns Result object with success status and optional error message
 */
export async function signUp(formData: FormData) {
    const { t, locale } = await getTranslations();
    const authService = new AuthService();
    const emailService = new EmailService();
    const sessionService = new SessionService();

    try {
        // Rate limiting by IP address
        const clientIp = await getClientIp();
        const rateLimitResult = RateLimitService.signupLimiter.check(3, clientIp);

        if (!rateLimitResult.success) {
            return {
                success: false,
                error: t('errors.auth.tooManyAttempts', {
                    minutes: Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
                })
            };
        }

        // Extract and validate form data
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role: formData.get("role") as any,
        };

        const validation = AuthValidator.validateSignUp(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return { success: false, error: firstError };
        }

        // Delegate business logic to service
        const { user, verificationToken } = await authService.signUp(data);

        // Send verification email
        await emailService.sendVerification(
            user.email,
            user.name || 'User',
            verificationToken,
            locale
        );

        // Create session
        await sessionService.createSession(user);

        return { success: true, needsVerification: true };
    } catch (error) {
        console.error("[AuthController] Sign up error:", error);

        if (error instanceof Error && error.message.startsWith('auth.')) {
            return { success: false, error: t(`errors.${error.message}`) };
        }

        return { success: false, error: t('errors.auth.signUpFailed') };
    }
}

/**
 * Sign in an existing user
 * Handles authentication, rate limiting, and session creation
 *
 * @param formData - Form data from signin form containing email and password
 * @returns Result object with success status and optional error message
 */
export async function signIn(formData: FormData) {
    const { t } = await getTranslations();
    const authService = new AuthService();
    const sessionService = new SessionService();

    try {
        // Rate limiting by IP address
        const clientIp = await getClientIp();
        const rateLimitResult = RateLimitService.loginLimiter.check(5, clientIp);

        if (!rateLimitResult.success) {
            return {
                success: false,
                error: t('errors.auth.tooManyAttempts', {
                    minutes: Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
                })
            };
        }

        // Extract and validate form data
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const validation = AuthValidator.validateSignIn(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return { success: false, error: firstError };
        }

        // Delegate business logic to service
        const user = await authService.signIn(data);

        // Create session
        await sessionService.createSession(user);

        return { success: true };
    } catch (error) {
        console.error("[AuthController] Sign in error:", error);

        if (error instanceof Error && error.message.startsWith('auth.')) {
            return { success: false, error: t(`errors.${error.message}`) };
        }

        return { success: false, error: t('errors.auth.signInFailed') };
    }
}

/**
 * Sign out current user
 * Destroys session and redirects to login page
 */
export async function signOut(): Promise<void> {
    const sessionService = new SessionService();
    await sessionService.destroySession();
    redirect("/login");
}

/**
 * Verify email with token
 * Marks user's email as verified and sends welcome email
 *
 * @param token - Email verification token from URL parameter
 * @returns Result object with success status and optional error message
 */
export async function verifyEmail(token: string) {
    const { t, locale } = await getTranslations();
    const authService = new AuthService();
    const emailService = new EmailService();
    const sessionService = new SessionService();

    try {
        const result = await authService.verifyEmail(token);

        if (!result.valid) {
            return { success: false, error: t(`errors.${result.error}`) };
        }

        // Get current session user and send welcome email
        const user = await sessionService.getCurrentSessionUser();
        if (user) {
            await emailService.sendWelcome(
                user.email,
                user.name || 'User',
                locale
            );
        }

        return { success: true };
    } catch (error) {
        console.error('[AuthController] Email verification error:', error);
        return { success: false, error: t('errors.auth.verificationFailed') };
    }
}

/**
 * Request password reset
 * Sends password reset email if user exists (doesn't reveal if email exists for security)
 *
 * @param formData - Form data containing email address
 * @returns Result object (always returns success for security)
 */
export async function requestPasswordReset(formData: FormData) {
    const { t, locale } = await getTranslations();
    const authService = new AuthService();
    const emailService = new EmailService();

    try {
        // Rate limiting by IP address
        const clientIp = await getClientIp();
        const rateLimitResult = RateLimitService.passwordResetLimiter.check(3, clientIp);

        if (!rateLimitResult.success) {
            return {
                success: false,
                error: t('errors.auth.tooManyAttempts', {
                    minutes: Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
                })
            };
        }

        // Validate input
        const data = { email: formData.get("email") as string };
        const validation = AuthValidator.validatePasswordResetRequest(data);

        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return { success: false, error: firstError };
        }

        // Delegate business logic to service
        const result = await authService.requestPasswordReset(data);

        // Send email if user exists
        if (result) {
            await emailService.sendPasswordReset(
                result.user.email,
                result.user.name || 'User',
                result.token,
                locale
            );
        }

        // Always return success (security: don't reveal if email exists)
        return { success: true, message: t('success.auth.resetEmailSent') };
    } catch (error) {
        console.error("[AuthController] Password reset request error:", error);
        return { success: false, error: t('errors.auth.resetRequestFailed') };
    }
}

/**
 * Reset password with token
 * Updates user's password using the reset token from email
 *
 * @param formData - Form data containing reset token and new password
 * @returns Result object with success status and optional error message
 */
export async function resetPassword(formData: FormData) {
    const { t } = await getTranslations();
    const authService = new AuthService();

    try {
        // Validate input
        const data = {
            token: formData.get("token") as string,
            password: formData.get("password") as string,
        };

        const validation = AuthValidator.validatePasswordReset(data);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return { success: false, error: firstError };
        }

        // Delegate business logic to service
        const result = await authService.resetPassword(data);

        if (!result.valid) {
            return { success: false, error: t(`errors.${result.error}`) };
        }

        return { success: true };
    } catch (error) {
        console.error('[AuthController] Password reset error:', error);
        return { success: false, error: t('errors.auth.resetFailed') };
    }
}

/**
 * Verify reset token validity
 * Checks if password reset token is valid and not expired (without resetting password)
 *
 * @param token - Password reset token to verify
 * @returns Result object with validity status and optional error message
 */
export async function verifyResetToken(token: string) {
    const { t } = await getTranslations();
    const authService = new AuthService();

    try {
        const result = await authService.verifyPasswordResetToken(token);

        if (!result.valid) {
            return { valid: false, error: t(`errors.${result.error}`) };
        }

        return { valid: true };
    } catch (error) {
        console.error('[AuthController] Token verification error:', error);
        return { valid: false, error: t('errors.auth.tokenVerificationFailed') };
    }
}

/**
 * Resend verification email (public/unauthenticated)
 * Sends new verification email if user exists and email not verified
 *
 * @param formData - Form data containing email address
 * @returns Result object (always returns success for security)
 */
export async function resendVerificationEmail(formData: FormData) {
    const { t, locale } = await getTranslations();
    const authService = new AuthService();
    const emailService = new EmailService();

    try {
        // Rate limiting by email address
        const email = formData.get("email") as string;
        const rateLimitResult = RateLimitService.emailResendLimiter.check(3, email);

        if (!rateLimitResult.success) {
            return {
                success: false,
                error: t('errors.auth.tooManyAttempts', {
                    minutes: Math.ceil((rateLimitResult.reset - Date.now()) / 60000)
                })
            };
        }

        // Validate input
        const data = { email };
        const validation = AuthValidator.validateResendVerification(data);

        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return { success: false, error: firstError };
        }

        // Delegate business logic to service
        const result = await authService.resendVerificationEmail(data);

        // Send email if user exists and not verified
        if (result) {
            await emailService.sendVerification(
                result.user.email,
                result.user.name || 'User',
                result.verificationToken,
                locale
            );
        }

        // Always return success (security: don't reveal if email exists)
        return { success: true, message: t('success.auth.verificationEmailSent') };
    } catch (error) {
        console.error('[AuthController] Resend verification email error:', error);
        return { success: false, error: t('errors.auth.resendFailed') };
    }
}

/**
 * Resend verification email (authenticated)
 * Sends new verification email for currently logged-in user
 *
 * @returns Result object with success status and optional error message
 */
export async function resendVerificationEmailAuthenticated() {
    const { t, locale } = await getTranslations();
    const authService = new AuthService();
    const emailService = new EmailService();
    const sessionService = new SessionService();

    try {
        const user = await sessionService.getCurrentSessionUser();

        if (!user) {
            return { success: false, error: t('errors.auth.notAuthenticated') };
        }

        // Delegate business logic to service
        const result = await authService.resendVerificationEmailAuthenticated(user.id);

        // Send email
        await emailService.sendVerification(
            result.user.email,
            result.user.name || 'User',
            result.verificationToken,
            locale
        );

        return { success: true, message: t('success.auth.verificationEmailSent') };
    } catch (error) {
        console.error('[AuthController] Resend verification email error:', error);

        if (error instanceof Error && error.message.startsWith('auth.')) {
            return { success: false, error: t(`errors.${error.message}`) };
        }

        return { success: false, error: t('errors.auth.resendFailed') };
    }
}
