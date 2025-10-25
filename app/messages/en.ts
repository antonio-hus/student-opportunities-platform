export default {
    metadata: {
        title: "University Practical Work Opportunities Platform",
        description: "Made by Antonio Hus as part of bachelor thesis",
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
        }
    }
} as const;
