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
 * Welcome email template
 * Generates HTML email sent after successful email verification
 *
 * @param name - User's name
 * @param dashboardUrl - URL to user dashboard
 * @param translations - Translation function for the user's locale
 * @param locale - Locale language
 * @returns HTML string for email body
 */
export function getWelcomeEmailTemplate(
    name: string,
    dashboardUrl: string,
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
            <title>${t('email.welcome.subject')}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <div style="text-align: center; margin-bottom: 20px;">
                                        <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background-color: ${colors.successLight}; line-height: 64px;">
                                            <span style="font-size: 32px;">✓</span>
                                        </div>
                                    </div>
                                    <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3; text-align: center;">
                                        ${t('email.welcome.greeting')} ${name}!
                                    </h2>
                                    <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                                        ${t('email.welcome.body')}
                                    </p>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="${dashboardUrl}" 
                                                   style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                    ${t('email.welcome.buttonText')}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
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
