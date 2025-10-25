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
        }
    }
} as const;
