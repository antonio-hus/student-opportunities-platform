export default {
    metadata: {
        title: "University Practical Work Opportunities Platform",
        description: "Made by Antonio Hus as part of bachelor thesis",
        platformName: "University Platform",
    },
    pages: {
        home: {
            title: "Find Your Opportunity",
            subtitle: "Connect with organizations"
        },
        auth: {
            login: {
                title: "Sign In",
                subtitle: "Welcome back to the platform",
                email: "Email",
                password: "Password",
                forgotPassword: "Forgot password?",
                signIn: "Sign In",
                signingIn: "Signing in...",
                noAccount: "Don't have an account?",
                createOne: "Create one"
            },
            register: {
                title: "Create Account",
                subtitle: "Join the platform to start your journey",
                fullName: "Full Name",
                email: "Email",
                role: "I am a...",
                roleStudent: "Student",
                roleCoordinator: "Coordinator/Faculty",
                roleOrganization: "Organization (NGO/Company)",
                password: "Password",
                passwordHint: "Minimum 8 characters",
                createAccount: "Create Account",
                creatingAccount: "Creating account...",
                hasAccount: "Already have an account?",
                signIn: "Sign in"
            },
            verifyEmail: {
                title: "Verify Email",
                subtitle: "Please wait while we verify your email address",
                verifying: "Verifying your email...",
                success: "Email verified successfully!",
                failed: "Verification failed",
                noToken: "No verification token provided",
                redirecting: "Redirecting to dashboard...",
                backToLogin: "Back to login"
            },
            forgotPassword: {
                title: "Forgot Password",
                subtitle: "Enter your email to receive a password reset link",
                email: "Email",
                sendResetLink: "Send Reset Link",
                sending: "Sending...",
                success: "If an account exists, a reset email has been sent",
                backToLogin: "Back to login"
            },
            resetPassword: {
                title: "Reset Password",
                subtitle: "Enter your new password",
                newPassword: "New Password",
                confirmPassword: "Confirm Password",
                passwordHint: "Minimum 8 characters",
                passwordMismatch: "Passwords do not match",
                noToken: "No reset token provided",
                invalidToken: "Invalid or expired reset token",
                verifyingToken: "Verifying reset link...",
                requestNewLink: "Request a new reset link",
                resetPassword: "Reset Password",
                resetting: "Resetting..."
            },
            accessControl: {
                accessDenied: "Access Denied",
                noPermission: "You don't have permission to access this page.",
                goToDashboard: "Go to Dashboard"
            },
            session: {
                expired: "Your session has expired",
                pleaseSignIn: "Please sign in again to continue",
                refreshing: "Refreshing session..."
            }
        },
    },
    email: {
        verification: {
            from: "University Platform",
            subject: "Verify your email address",
            greeting: "Welcome",
            body: "Thank you for registering on our platform. Please verify your email address by clicking the button below:",
            buttonText: "Verify Email",
            orCopy: "Or copy and paste this link into your browser:",
            expiry: "This link will expire in 24 hours.",
            ignore: "If you didn't create an account, you can safely ignore this email."
        },
        welcome: {
            from: "University Platform",
            subject: "Welcome to the platform!",
            greeting: "Welcome",
            body: "Your email has been successfully verified. You can now access all features of the platform.",
            buttonText: "Go to Dashboard"
        },
        passwordReset: {
            from: "University Platform",
            subject: "Reset your password",
            greeting: "Hello",
            body: "You requested to reset your password. Click the button below to create a new password:",
            buttonText: "Reset Password",
            orCopy: "Or copy and paste this link into your browser:",
            expiry: "This link will expire in 1 hour.",
            ignore: "If you didn't request a password reset, you can safely ignore this email."
        },
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
            tooManyAttempts: "Too many login attempts. Please try again in {minutes} minutes.",
            tooManySignups: "Too many signup attempts. Please try again in {minutes} minutes.",
            tooManyResetRequests: "Too many password reset requests. Please try again in {minutes} minutes.",
        },
        email: {
            verificationFailed: "Failed to send verification email",
            resetFailed: "Failed to send password reset email"
        }
    },
    success: {
        auth: {
            resetEmailSent: "If an account exists, a reset email has been sent"
        }
    },
} as const;
