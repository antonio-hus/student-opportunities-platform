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
            }
        },
    }
} as const;
