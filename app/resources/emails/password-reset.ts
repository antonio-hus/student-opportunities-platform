/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { getThemeColors } from '@/resources/theme/colors';
import { Locale } from '@/src/utils/i18n';

/////////////////////////////
///   TEMPLATE FUNCTION   ///
/////////////////////////////
/**
 * Password reset email template
 * Generates HTML email for password reset requests
 *
 * @param name - User's name
 * @param resetUrl - Complete password reset URL with token
 * @param translations - Translation function for the user's locale
 * @param locale - Locale language
 * @returns HTML string for email body
 */
export function getPasswordResetEmailTemplate(
    name: string,
    resetUrl: string,
    translations: any,
    locale: Locale = 'en'
): string {
    const colors = getThemeColors('light');
    const t = translations;

    return `
        <!DOCTYPE html>
        <html lang="${locale}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${t('email.passwordReset.subject')}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">
                                        ${t('email.passwordReset.greeting')} ${name}
                                    </h2>
                                    <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                        ${t('email.passwordReset.body')}
                                    </p>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="${resetUrl}" 
                                                   style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                    ${t('email.passwordReset.buttonText')}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 24px 0 8px 0;">
                                        ${t('email.passwordReset.orCopy')}
                                    </p>
                                    <p style="margin: 0 0 16px 0;">
                                        <a href="${resetUrl}" 
                                           style="color: ${colors.primary}; font-size: 14px; text-decoration: underline; word-break: break-all;">
                                            ${resetUrl}
                                        </a>
                                    </p>
                                    <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0;">
                                        ${t('email.passwordReset.expiry')}
                                    </p>
                                    <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                        ${t('email.passwordReset.ignore')}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 30px; background-color: ${colors.muted}; border-top-width: 1px; border-top-style: solid; border-top-color: ${colors.border};">
                                    <p style="color: ${colors.textSecondary}; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                        © ${new Date().getFullYear()} ${t('metadata.platformName')}. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}
