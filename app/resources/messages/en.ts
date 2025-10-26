export default {
    metadata: {
        title: "University Practical Work Opportunities Platform",
        description: "Made by Antonio Hus as part of bachelor thesis",
        platformName: "University Platform",
    },
    pages: {
        home: {
            title: "Find Your Opportunity",
            subtitle: "Connect students with practical training opportunities"
        },
        auth: {
            login: {
                title: "Sign In",
                subtitle: "Welcome back! Please sign in to continue",
                email: "Email Address",
                password: "Password",
                forgotPassword: "Forgot password?",
                signIn: "Sign In",
                signingIn: "Signing in...",
                noAccount: "Don't have an account?",
                createOne: "Create one"
            },
            register: {
                title: "Create Account",
                subtitle: "Join our platform to find practical work opportunities",
                fullName: "Full Name",
                email: "Email Address",
                role: "I am a",
                roleStudent: "Student",
                roleCoordinator: "Coordinator",
                roleOrganization: "Organization",
                password: "Password",
                passwordHint: "Must be at least 8 characters",
                createAccount: "Create Account",
                creatingAccount: "Creating account...",
                hasAccount: "Already have an account?",
                signIn: "Sign in",
                alreadyRegistered: "Already registered but didn't receive verification email?",
                resendVerificationLink: "Resend verification email"
            },
            accessControl: {
                accessDenied: "Access Denied",
                noPermission: "You don't have permission to access this page.",
                requiredRoles: "Required roles",
                goToDashboard: "Go to Dashboard"
            },
            session: {
                expired: "Your session has expired",
                pleaseSignIn: "Please sign in again to continue",
                refreshing: "Refreshing session..."
            },
            forgotPassword: {
                title: "Reset Password",
                subtitle: "Enter your email to receive a password reset link",
                emailLabel: "Email Address",
                emailPlaceholder: "your.email@example.com",
                sendButton: "Send Reset Link",
                sending: "Sending...",
                success: "If an account exists with this email, a reset link has been sent",
                checkInbox: "Please check your inbox for the password reset link",
                backToLogin: "Back to Login"
            },
            resetPassword: {
                title: "Set New Password",
                subtitle: "Enter your new password below",
                newPassword: "New Password",
                confirmPassword: "Confirm Password",
                passwordHint: "Must be at least 8 characters",
                passwordMismatch: "Passwords do not match",
                resetPassword: "Reset Password",
                resetting: "Resetting...",
                verifyingToken: "Verifying reset link...",
                noToken: "No reset token provided",
                invalidToken: "This reset link is invalid or has expired",
                requestNew: "Request a new password reset",
                success: "Password reset successfully!",
                redirecting: "Redirecting to login..."
            },
            verifyEmail: {
                title: "Email Verification",
                subtitle: "Enter the email address for verification",
                verifying: "Verifying your email...",
                success: "Email Verified!",
                successMessage: "Your email has been successfully verified",
                goToDashboard: "Go to Dashboard",
                error: "Verification Failed",
                invalidToken: "This verification link is invalid or has expired",
                requestNew: "Request a new verification email",
                noToken: "No verification token provided",
                failed: "Email verification failed",
                redirecting: "Redirecting to dashboard...",
                backToLogin: "Back to Login"
            },
            verifyEmailPending: {
                title: "Check Your Email",
                subtitle: "We sent a verification link to ",
                nextSteps: "What's next?",
                step1: "Check your email inbox (and spam folder)",
                step2: "Click the verification link in the email",
                step3: "You'll be automatically redirected to your dashboard",
                didNotReceive: "Didn't receive the email?",
                resendButton: "Resend Verification Email",
                sending: "Sending...",
                resendIn: "Resend in",
                seconds: "seconds",
                waitMessage: "Please wait before requesting another email",
                emailSent: "Verification email sent! Please check your inbox.",
                or: "or",
                signOut: "Sign Out",
                signingOut: "Signing out...",
                signOutHelp: "Sign out if you need to use a different account"
            },
            resendVerification: {
                title: "Resend Verification Email",
                subtitle: "Enter your email to receive a new verification link",
                emailLabel: "Email Address",
                emailPlaceholder: "your.email@example.com",
                sendButton: "Send Verification Email",
                sending: "Sending...",
                resendIn: "Resend in {seconds}s",
                waitMessage: "Please wait before requesting another verification email",
                success: "Verification email sent! Please check your inbox.",
                checkInbox: "If an account exists with this email, you will receive a verification link.",
                backToLogin: "Back to Login"
            }
        },
        navigation: {
            student: {
                overview: "Overview",
                discover: "Discover",
                applications: "Applications",
                myProjects: "My Projects",
                portfolio: "Portfolio",
                profile: "Profile",
                settings: "Settings",
                student: "Student",
                signOut: "Sign Out"
            },
            coordinator: {
                overview: "Overview",
                projectReviews: "Project Reviews",
                studentApplications: "Student Applications",
                supervisedProjects: "Supervised Projects",
                evaluations: "Evaluations",
                profile: "Profile",
                settings: "Settings",
                coordinator: "Coordinator",
                signOut: "Sign Out"
            },
            organization: {
                overview: "Overview",
                projects: "Projects",
                applications: "Applications",
                analytics: "Analytics",
                profile: "Profile",
                settings: "Settings",
                organization: "Organization",
                signOut: "Sign Out"
            },
            admin: {
                overview: "Overview",
                userManagement: "User Management",
                organizations: "Organizations",
                projectModeration: "Project Moderation",
                analytics: "Analytics",
                platformConfig: "Platform Config",
                security: "Security",
                settings: "Settings",
                administrator: "Administrator",
                signOut: "Sign Out"
            },
            footer: {
                platformName: "University Platform",
                allRightsReserved: "All rights reserved",
                privacy: "Privacy Policy",
                terms: "Terms of Service",
                contact: "Contact"
            }
        }
    },
    email: {
        verification: {
            from: "University Platform",
            subject: "Verify Your Email Address",
            greeting: "Hello",
            body: "Thank you for registering! Please verify your email address by clicking the button below.",
            buttonText: "Verify Email",
            orCopy: "Or copy and paste this link into your browser:",
            expiry: "This link will expire in 24 hours.",
            ignore: "If you didn't create an account, you can safely ignore this email."
        },
        welcome: {
            from: "University Platform",
            subject: "Welcome to University Platform",
            greeting: "Welcome",
            body: "Your email has been verified! You can now access all features of the platform.",
            buttonText: "Go to Dashboard"
        },
        passwordReset: {
            from: "University Platform",
            subject: "Reset Your Password",
            greeting: "Hello",
            body: "We received a request to reset your password. Click the button below to set a new password.",
            buttonText: "Reset Password",
            orCopy: "Or copy and paste this link into your browser:",
            expiry: "This link will expire in 1 hour.",
            ignore: "If you didn't request a password reset, you can safely ignore this email."
        }
    },
    errors: {
        validation: {
            nameMinLength: "Name must be at least 2 characters",
            invalidEmail: "Invalid email address",
            passwordMinLength: "Password must be at least 8 characters",
            passwordRequired: "Password is required",
            emailRequired: "Email is required",
            missingFields: "Missing required fields"
        },
        auth: {
            accountExists: "An account with this email already exists",
            invalidCredentials: "Invalid email or password",
            accountDeactivated: "Your account has been deactivated. Please contact support.",
            signUpFailed: "Failed to create account. Please try again.",
            signInFailed: "Failed to sign in. Please try again.",
            verificationFailed: "Failed to verify email",
            resetRequestFailed: "Failed to process request. Please try again.",
            resetFailed: "Failed to reset password",
            invalidResetToken: "Invalid reset token",
            tokenVerificationFailed: "Failed to verify token",
            notAuthenticated: "You must be logged in",
            userNotFound: "User not found",
            alreadyVerified: "Email is already verified",
            tooManyAttempts: "Too many login attempts. Please try again in {minutes} minutes.",
            tooManySignups: "Too many signup attempts. Please try again in {minutes} minutes.",
            tooManyResetRequests: "Too many password reset requests. Please try again in {minutes} minutes.",
            tooManyResendAttempts: "Too many resend attempts. Please try again in {minutes} minutes.",
            resendFailed: "Failed to resend verification email. Please try again."
        },
        email: {
            verificationFailed: "Failed to send verification email",
            resetFailed: "Failed to send password reset email"
        }
    },
    success: {
        auth: {
            resetEmailSent: "If an account exists with this email, a reset link has been sent",
            verificationEmailSent: "If an account exists with this email, a verification link has been sent"
        }
    }
} as const;
