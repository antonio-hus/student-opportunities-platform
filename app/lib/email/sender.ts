/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import nodemailer from 'nodemailer'
// Project Libraries
import enMessages from '@/messages/en'
import roMessages from '@/messages/ro'
import { getThemeColors } from '@/lib/theme/colors'

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

// Get messages for locale
const messages: Record<string, typeof enMessages | typeof roMessages> = {
    en: enMessages,
    ro: roMessages,
}

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
    const t = messages[locale]?.email?.verification || messages.en.email.verification
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    const mailOptions = {
        from: `"${t.from}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t.subject,
        html: `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t.subject}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <!-- Greeting -->
                                        <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">
                                            ${t.greeting} ${name}!
                                        </h2>
                                        
                                        <!-- Body -->
                                        <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                            ${t.body}
                                        </p>
                                        
                                        <!-- Button -->
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${verificationUrl}" 
                                                       style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                        ${t.buttonText}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative Link -->
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 24px 0 8px 0;">
                                            ${t.orCopy}
                                        </p>
                                        <p style="margin: 0 0 16px 0;">
                                            <a href="${verificationUrl}" 
                                               style="color: ${colors.primary}; font-size: 14px; text-decoration: underline; word-break: break-all;">
                                                ${verificationUrl}
                                            </a>
                                        </p>
                                        
                                        <!-- Expiry Notice -->
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0;">
                                            ${t.expiry}
                                        </p>
                                        
                                        <!-- Ignore Notice -->
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                            ${t.ignore}
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 30px; background-color: ${colors.muted}; border-top: 1px solid ${colors.border};">
                                        <p style="color: ${colors.textSecondary}; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                            © ${new Date().getFullYear()} University Platform. All rights reserved.
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
        return { success: false, error: 'Failed to send verification email' }
    }
}

// Send welcome email after verification
export async function sendWelcomeEmail(
    email: string,
    name: string,
    locale: string = 'en'
) {
    const t = messages[locale]?.email?.welcome || messages.en.email.welcome

    const mailOptions = {
        from: `"${t.from}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t.subject,
        html: `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t.subject}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <!-- Success Icon -->
                                        <div style="text-align: center; margin-bottom: 20px;">
                                            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background-color: ${colors.successLight};">
                                                <svg width="64" height="64" viewBox="0 0 64 64" style="vertical-align: middle;">
                                                    <path d="M20 32 L28 40 L44 24" stroke="${colors.success}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <!-- Greeting -->
                                        <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3; text-align: center;">
                                            ${t.greeting} ${name}!
                                        </h2>
                                        
                                        <!-- Body -->
                                        <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                                            ${t.body}
                                        </p>
                                        
                                        <!-- Button -->
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                                                       style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                        ${t.buttonText}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 30px; background-color: ${colors.muted}; border-top: 1px solid ${colors.border};">
                                        <p style="color: ${colors.textSecondary}; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                            © ${new Date().getFullYear()} University Platform. All rights reserved.
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
    const t = messages[locale]?.email?.passwordReset || messages.en.email.passwordReset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    const mailOptions = {
        from: `"${t.from}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: t.subject,
        html: `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t.subject}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${colors.surface};">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${colors.background}; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: ${colors.textPrimary}; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                                            ${t.greeting} ${name}
                                        </h2>
                                        <p style="color: ${colors.textPrimary}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                            ${t.body}
                                        </p>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${resetUrl}" 
                                                       style="display: inline-block; background-color: ${colors.primary}; color: ${colors.primaryForeground}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                                        ${t.buttonText}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 24px 0 8px 0;">
                                            ${t.orCopy}
                                        </p>
                                        <p style="margin: 0 0 16px 0;">
                                            <a href="${resetUrl}" 
                                               style="color: ${colors.primary}; font-size: 14px; text-decoration: underline; word-break: break-all;">
                                                ${resetUrl}
                                            </a>
                                        </p>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0;">
                                            ${t.expiry}
                                        </p>
                                        <p style="color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                            ${t.ignore}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 30px; background-color: ${colors.muted}; border-top: 1px solid ${colors.border};">
                                        <p style="color: ${colors.textSecondary}; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                            © ${new Date().getFullYear()} University Platform. All rights reserved.
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
        return { success: false, error: 'Failed to send password reset email' }
    }
}
