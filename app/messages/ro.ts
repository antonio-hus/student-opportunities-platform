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
        verifyEmail: {
            title: "Verificare Email",
            subtitle: "Te rugăm să aștepți în timp ce verificăm adresa ta de email",
            verifying: "Se verifică emailul...",
            success: "Email verificat cu succes!",
            failed: "Verificarea a eșuat",
            noToken: "Nu a fost furnizat niciun token de verificare",
            redirecting: "Redirecționare către dashboard...",
            backToLogin: "Înapoi la autentificare"
        }
    },
    email: {
        verification: {
            from: "Platforma Universitară",
            subject: "Verifică-ți adresa de email",
            greeting: "Bine ai venit",
            body: "Îți mulțumim că te-ai înregistrat pe platforma noastră. Te rugăm să îți verifici adresa de email făcând clic pe butonul de mai jos:",
            buttonText: "Verifică Emailul",
            orCopy: "Sau copiază și lipește acest link în browser:",
            expiry: "Acest link va expira în 24 de ore.",
            ignore: "Dacă nu ai creat un cont, poți ignora în siguranță acest email."
        },
        welcome: {
            from: "Platforma Universitară",
            subject: "Bine ai venit pe platformă!",
            greeting: "Bine ai venit",
            body: "Emailul tău a fost verificat cu succes. Acum poți accesa toate funcționalitățile platformei.",
            buttonText: "Mergi la Dashboard"
        }
    }
} as const;
