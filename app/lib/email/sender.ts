/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import nodemailer from 'nodemailer'
// Project Libraries
import { getThemeColors } from '@/lib/theme/colors'
import { getTranslationsForLocale } from '@/i18n/config'

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// Get theme colors (always use light mode for emails for better compatibility)
const colors = getThemeColors('light')

/////////////////////////////
///   EMAIL FUNCTIONS     ///
/////////////////////////////
// Send verification email
export async function sendVerificationEmail(
    email: string,
    name: string,
    token: string,
    locale: string = 'en'
) {
    const t = getTranslationsForLocale(locale)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    const mailOptions = {
        from: `"${t('email.verification.from')}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t('email.verification.subject'),
        html: `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t('email.verification.subject')}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">
                                            ${t('email.verification.greeting')} ${name}!
                                        </h2>
                                        <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                            ${t('email.verification.body')}
                                        </p>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                            <tr>
                                                <td>
                                                    <a href="${verificationUrl}" 
                                                       style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                        ${t('email.verification.buttonText')}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 24px 0 8px 0;">
                                            ${t('email.verification.orCopy')}
                                        </p>
                                        <p style="margin: 0 0 16px 0;">
                                            <a href="${verificationUrl}" 
                                               style="color: ${colors.primary}; font-size: 14px; text-decoration: underline; word-break: break-all;">
                                                ${verificationUrl}
                                            </a>
                                        </p>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0;">
                                            ${t('email.verification.expiry')}
                                        </p>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                            ${t('email.verification.ignore')}
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
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error('Error sending verification email:', error)
        return { success: false, error: t('errors.email.verificationFailed') }
    }
}

// Send welcome email after verification
export async function sendWelcomeEmail(
    email: string,
    name: string,
    locale: string = 'en'
) {
    const t = getTranslationsForLocale(locale)

    const mailOptions = {
        from: `"${t('email.welcome.from')}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t('email.welcome.subject'),
        html: `
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
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <div style="text-align: center; margin-bottom: 20px;">
                                            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background-color: ${colors.successLight};">
                                                <svg width="64" height="64" viewBox="0 0 64 64" style="vertical-align: middle;">
                                                    <path d="M20 32 L28 40 L44 24" stroke="${colors.success}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
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
                                                <td>
                                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
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
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Error sending welcome email:', error)
    }
}

// Send password reset email
export async function sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    locale: string = 'en'
) {
    const t = getTranslationsForLocale(locale)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    const mailOptions = {
        from: `"${t('email.passwordReset.from')}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t('email.passwordReset.subject'),
        html: `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t('email.passwordReset.subject')}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                                            ${t('email.passwordReset.greeting')} ${name}
                                        </h2>
                                        <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                            ${t('email.passwordReset.body')}
                                        </p>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                            <tr>
                                                <td>
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
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error('Error sending password reset email:', error)
        return { success: false, error: t('errors.email.resetFailed') }
    }
}
