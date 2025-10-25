export default {
    metadata: {
        title: "Platforma Universitară pentru Oportunități de Practică",
        description: "Realizat de Antonio Hus ca parte a tezei de licență",
    },
    pages: {
        home: {
            title: "Găsește-ți Oportunitatea",
            subtitle: "Conectează-te cu organizații"
        },
        auth: {
            login: {
                title: "Autentificare",
                subtitle: "Bine ai revenit pe platformă",
                email: "Email",
                password: "Parolă",
                signIn: "Autentifică-te",
                signingIn: "Se autentifică...",
                noAccount: "Nu ai un cont?",
                createOne: "Creează unul"
            },
            register: {
                title: "Creare Cont",
                subtitle: "Alătură-te platformei pentru a începe călătoria",
                fullName: "Nume Complet",
                email: "Email",
                role: "Sunt un/o...",
                roleStudent: "Student",
                roleCoordinator: "Coordonator/Facultate",
                roleOrganization: "Organizație (ONG/Companie)",
                password: "Parolă",
                passwordHint: "Minim 8 caractere",
                createAccount: "Creează Cont",
                creatingAccount: "Se creează contul...",
                hasAccount: "Ai deja un cont?",
                signIn: "Autentifică-te"
            }
        },
    }
} as const;
