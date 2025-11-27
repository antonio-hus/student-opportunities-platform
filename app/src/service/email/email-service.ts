/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import nodemailer, { Transporter } from 'nodemailer';
// Project Libraries
import { getVerificationEmailTemplate } from '@/resources/emails/verification';
import { getWelcomeEmailTemplate } from '@/resources/emails/welcome';
import { getPasswordResetEmailTemplate } from '@/resources/emails/password-reset';
import { getTranslationsFor, Locale } from '@/src/utils/i18n';

/////////////////////////////
///    SERVICE SECTION    ///
/////////////////////////////
/**
 * Email Service
 * Handles sending transactional emails with templating and i18n support
 * Implements singleton pattern for email transporter to reuse SMTP connection
 * All email templates are stored in /resources/emails
 */
export class EmailService {
    private static transporter: Transporter | null = null;

    /**
     * Gets or creates the email transporter singleton instance
     * Reuses SMTP connection across all email operations
     *
     * @returns Nodemailer transporter instance
     */
    private getTransporter(): Transporter {
        if (!EmailService.transporter) {
            EmailService.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            console.log('[EmailService] SMTP transporter initialized');
        }

        return EmailService.transporter;
    }

    /**
     * Verifies SMTP transporter configuration
     * Should be called on application startup
     *
     * @returns True if connection successful, false otherwise
     */
    async verifyConnection(): Promise<boolean> {
        try {
            await this.getTransporter().verify();
            console.log('[EmailService] SMTP connection verified');
            return true;
        } catch (error) {
            console.error('[EmailService] SMTP connection failed:', error);
            return false;
        }
    }

    /**
     * Sends verification email to new user
     * Contains link with verification token
     *
     * @param email - Recipient email address
     * @param name - User's name for personalization
     * @param token - Verification token to include in URL
     * @param locale - User's language preference for translations
     */
    async sendVerification(
        email: string,
        name: string,
        token: string,
        locale: Locale = 'en'
    ): Promise<void> {
        try {
            const t = getTranslationsFor(locale);
            const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

            const htmlBody = getVerificationEmailTemplate(name, verificationUrl, t, locale);

            await this.getTransporter().sendMail({
                from: `"${t('email.verification.from')}" <${process.env.SMTP_USER}>`,
                to: email,
                subject: t('email.verification.subject'),
                html: htmlBody,
            });

            console.log(`[EmailService] Verification email sent to ${email}`);
        } catch (error) {
            console.error('[EmailService] Failed to send verification email:', error);
            throw new Error('email.verificationFailed');
        }
    }

    /**
     * Sends welcome email after successful email verification
     * Celebrates user joining the platform
     *
     * @param email - Recipient email address
     * @param name - User's name for personalization
     * @param locale - User's language preference for translations
     */
    async sendWelcome(
        email: string,
        name: string,
        locale: Locale = 'en'
    ): Promise<void> {
        try {
            const t = getTranslationsFor(locale);
            const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

            const htmlBody = getWelcomeEmailTemplate(name, dashboardUrl, t, locale);

            await this.getTransporter().sendMail({
                from: `"${t('email.welcome.from')}" <${process.env.SMTP_USER}>`,
                to: email,
                subject: t('email.welcome.subject'),
                html: htmlBody,
            });

            console.log(`[EmailService] Welcome email sent to ${email}`);
        } catch (error) {
            console.error('[EmailService] Failed to send welcome email:', error);
            // Don't throw - welcome email failure shouldn't break the flow
        }
    }

    /**
     * Sends password reset email with reset link
     * Contains link with password reset token
     *
     * @param email - Recipient email address
     * @param name - User's name for personalization
     * @param token - Password reset token to include in URL
     * @param locale - User's language preference for translations
     */
    async sendPasswordReset(
        email: string,
        name: string,
        token: string,
        locale: Locale = 'en'
    ): Promise<void> {
        try {
            const t = getTranslationsFor(locale);
            const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

            const htmlBody = getPasswordResetEmailTemplate(name, resetUrl, t, locale);

            await this.getTransporter().sendMail({
                from: `"${t('email.passwordReset.from')}" <${process.env.SMTP_USER}>`,
                to: email,
                subject: t('email.passwordReset.subject'),
                html: htmlBody,
            });

            console.log(`[EmailService] Password reset email sent to ${email}`);
        } catch (error) {
            console.error('[EmailService] Failed to send password reset email:', error);
            throw new Error('email.resetFailed');
        }
    }

    /**
     * Closes the SMTP connection
     * Should be called on application shutdown
     */
    async close(): Promise<void> {
        if (EmailService.transporter) {
            EmailService.transporter.close();
            EmailService.transporter = null;
            console.log('[EmailService] SMTP connection closed');
        }
    }
}
