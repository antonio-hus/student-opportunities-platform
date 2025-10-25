export default {
    metadata: {
        title: "Platforma Universitară pentru Oportunități de Practică",
        description: "Realizat de Antonio Hus ca parte a tezei de licență",
        platformName: "Platforma Universitară",
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
                forgotPassword: "Ai uitat parola?",
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
            },
            forgotPassword: {
                title: "Parolă Uitată",
                subtitle: "Introdu emailul pentru a primi un link de resetare",
                email: "Email",
                sendResetLink: "Trimite Link de Resetare",
                sending: "Se trimite...",
                success: "Dacă există un cont, un email de resetare a fost trimis",
                backToLogin: "Înapoi la autentificare"
            },
            resetPassword: {
                title: "Resetare Parolă",
                subtitle: "Introdu noua parolă",
                newPassword: "Parolă Nouă",
                confirmPassword: "Confirmă Parola",
                passwordHint: "Minim 8 caractere",
                passwordMismatch: "Parolele nu se potrivesc",
                noToken: "Lipsește tokenul de resetare",
                invalidToken: "Token de resetare invalid sau expirat",
                verifyingToken: "Se verifică linkul de resetare...",
                requestNewLink: "Solicită un nou link de resetare",
                resetPassword: "Resetează Parola",
                resetting: "Se resetează...",
            },
            accessControl: {
                accessDenied: "Acces Interzis",
                noPermission: "Nu ai permisiunea de a accesa această pagină.",
                goToDashboard: "Mergi la Dashboard"
            },
            session: {
                expired: "Sesiunea ta a expirat",
                pleaseSignIn: "Te rugăm să te autentifici din nou pentru a continua",
                refreshing: "Se reîmprospătează sesiunea..."
            }
        },
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
        },
        passwordReset: {
            from: "Platforma Universitară",
            subject: "Resetează-ți parola",
            greeting: "Bună ziua",
            body: "Ai solicitat resetarea parolei. Fă clic pe butonul de mai jos pentru a crea o parolă nouă:",
            buttonText: "Resetează Parola",
            orCopy: "Sau copiază și lipește acest link în browser:",
            expiry: "Acest link va expira într-o oră.",
            ignore: "Dacă nu ai solicitat o resetare a parolei, poți ignora în siguranță acest email."
        }
    },
    errors: {
        validation: {
            nameMinLength: "Numele trebuie să aibă cel puțin 2 caractere",
            invalidEmail: "Adresă de email invalidă",
            passwordMinLength: "Parola trebuie să aibă cel puțin 8 caractere",
            passwordRequired: "Parola este obligatorie",
            emailRequired: "Emailul este obligatoriu",
            missingFields: "Lipsesc câmpuri obligatorii"
        },
        auth: {
            accountExists: "Există deja un cont cu acest email",
            invalidCredentials: "Email sau parolă invalidă",
            accountDeactivated: "Contul tău a fost dezactivat. Te rugăm să contactezi suportul.",
            signUpFailed: "Crearea contului a eșuat. Te rugăm să încerci din nou.",
            signInFailed: "Autentificarea a eșuat. Te rugăm să încerci din nou.",
            verificationFailed: "Verificarea emailului a eșuat",
            resetRequestFailed: "Procesarea cererii a eșuat. Te rugăm să încerci din nou.",
            resetFailed: "Resetarea parolei a eșuat",
            invalidResetToken: "Token de resetare invalid",
            tokenVerificationFailed: "Verificarea tokenului a eșuat",
            tooManyAttempts: "Prea multe încercări de autentificare. Te rugăm să încerci din nou în {minutes} minute.",
            tooManySignups: "Prea multe încercări de înregistrare. Te rugăm să încerci din nou în {minutes} minute.",
            tooManyResetRequests: "Prea multe cereri de resetare a parolei. Te rugăm să încerci din nou în {minutes} minute.",
        },
        email: {
            verificationFailed: "Trimiterea emailului de verificare a eșuat",
            resetFailed: "Trimiterea emailului de resetare a eșuat"
        }
    },
    success: {
        auth: {
            resetEmailSent: "Dacă există un cont, un email de resetare a fost trimis"
        }
    },
} as const;
