export default {
    metadata: {
        title: "Platforma Universitară pentru Oportunități de Practică",
        description: "Realizat de Antonio Hus ca parte a tezei de licență",
        platformName: "Platforma Universitară",
    },
    pages: {
        home: {
            title: "Găsește-ți Oportunitatea",
            subtitle: "Conectează studenții cu oportunități de practică"
        },
        auth: {
            login: {
                title: "Autentificare",
                subtitle: "Bine ai revenit! Te rugăm să te autentifici pentru a continua",
                email: "Adresă de Email",
                password: "Parolă",
                forgotPassword: "Ai uitat parola?",
                signIn: "Autentifică-te",
                signingIn: "Se autentifică...",
                noAccount: "Nu ai un cont?",
                createOne: "Creează unul"
            },
            register: {
                title: "Creează Cont",
                subtitle: "Alătură-te platformei noastre pentru a găsi oportunități de practică",
                fullName: "Nume Complet",
                email: "Adresă de Email",
                role: "Sunt",
                roleStudent: "Student",
                roleCoordinator: "Coordonator",
                roleOrganization: "Organizație",
                password: "Parolă",
                passwordHint: "Trebuie să aibă cel puțin 8 caractere",
                createAccount: "Creează Cont",
                creatingAccount: "Se creează contul...",
                hasAccount: "Ai deja un cont?",
                signIn: "Autentifică-te",
                alreadyRegistered: "Deja înregistrat dar nu ai primit emailul de verificare?",
                resendVerificationLink: "Retrimite emailul de verificare"
            },
            accessControl: {
                accessDenied: "Acces Interzis",
                noPermission: "Nu ai permisiunea de a accesa această pagină.",
                requiredRoles: "Roluri necesare",
                goToDashboard: "Mergi la Dashboard"
            },
            session: {
                expired: "Sesiunea ta a expirat",
                pleaseSignIn: "Te rugăm să te autentifici din nou pentru a continua",
                refreshing: "Se reîmprospătează sesiunea..."
            },
            forgotPassword: {
                title: "Resetează Parola",
                subtitle: "Introdu adresa de email pentru a primi un link de resetare",
                emailLabel: "Adresă de Email",
                emailPlaceholder: "email.tau@exemplu.ro",
                sendButton: "Trimite Link de Resetare",
                sending: "Se trimite...",
                success: "Dacă există un cont cu acest email, un link de resetare a fost trimis",
                checkInbox: "Te rugăm să verifici inbox-ul pentru linkul de resetare a parolei",
                backToLogin: "Înapoi la Autentificare"
            },
            resetPassword: {
                title: "Setează Parolă Nouă",
                subtitle: "Introdu parola nouă mai jos",
                newPassword: "Parolă Nouă",
                confirmPassword: "Confirmă Parola",
                passwordHint: "Trebuie să aibă cel puțin 8 caractere",
                passwordMismatch: "Parolele nu se potrivesc",
                resetPassword: "Resetează Parola",
                resetting: "Se resetează...",
                verifyingToken: "Se verifică linkul de resetare...",
                noToken: "Nu a fost furnizat token de resetare",
                invalidToken: "Acest link de resetare este invalid sau a expirat",
                requestNew: "Solicită o nouă resetare a parolei",
                success: "Parola a fost resetată cu succes!",
                redirecting: "Se redirecționează către autentificare..."
            },
            verifyEmail: {
                title: "Verificare Email",
                subtitle: "Introdu adresa de e-mail pentru verificare",
                verifying: "Se verifică emailul tău...",
                success: "Email Verificat!",
                successMessage: "Emailul tău a fost verificat cu succes",
                goToDashboard: "Mergi la Dashboard",
                error: "Verificare Eșuată",
                invalidToken: "Acest link de verificare este invalid sau a expirat",
                requestNew: "Solicită un nou email de verificare",
                noToken: "Nu a fost furnizat niciun token de verificare",
                failed: "Verificarea emailului a eșuat",
                redirecting: "Redirecționare către dashboard...",
                backToLogin: "Înapoi la Autentificare"
            },
            verifyEmailPending: {
                title: "Verifică-ți Emailul",
                subtitle: "Am trimis un link de verificare la ",
                nextSteps: "Care sunt pașii următori?",
                step1: "Verifică inbox-ul emailului (și folderul spam)",
                step2: "Dă click pe linkul de verificare din email",
                step3: "Vei fi redirecționat automat către dashboard",
                didNotReceive: "Nu ai primit emailul?",
                resendButton: "Retrimite Email de Verificare",
                sending: "Se trimite...",
                resendIn: "Retrimite în",
                seconds: "secunde",
                waitMessage: "Te rugăm să aștepți înainte de a solicita un alt email",
                emailSent: "Email de verificare trimis! Te rugăm să verifici inbox-ul.",
                or: "sau",
                signOut: "Deconectează-te",
                signingOut: "Se deconectează...",
                signOutHelp: "Deconectează-te dacă trebuie să folosești un alt cont"
            },
            resendVerification: {
                title: "Retrimite Email de Verificare",
                subtitle: "Introdu adresa de email pentru a primi un nou link de verificare",
                emailLabel: "Adresă de Email",
                emailPlaceholder: "email.tau@exemplu.com",
                sendButton: "Trimite Email de Verificare",
                sending: "Se trimite...",
                resendIn: "Retrimite în {seconds}s",
                waitMessage: "Te rugăm să aștepți înainte de a solicita un alt email de verificare",
                success: "Email de verificare trimis! Te rugăm să verifici inbox-ul.",
                checkInbox: "Dacă există un cont cu acest email, vei primi un link de verificare.",
                backToLogin: "Înapoi la Autentificare"
            }
        },
        navigation: {
            student: {
                overview: "Prezentare Generală",
                discover: "Descoperă",
                applications: "Aplicații",
                myProjects: "Proiectele Mele",
                portfolio: "Portofoliu",
                profile: "Profil",
                settings: "Setări",
                student: "Student",
                signOut: "Deconectare"
            },
            coordinator: {
                overview: "Prezentare Generală",
                projectReviews: "Evaluări Proiecte",
                studentApplications: "Aplicații Studenți",
                supervisedProjects: "Proiecte Coordonate",
                evaluations: "Evaluări",
                profile: "Profil",
                settings: "Setări",
                coordinator: "Coordonator",
                signOut: "Deconectare"
            },
            organization: {
                overview: "Prezentare Generală",
                projects: "Proiecte",
                applications: "Aplicații",
                analytics: "Analiză",
                profile: "Profil",
                settings: "Setări",
                organization: "Organizație",
                signOut: "Deconectare"
            },
            admin: {
                overview: "Prezentare Generală",
                userManagement: "Gestionare Utilizatori",
                organizations: "Organizații",
                projectModeration: "Moderare Proiecte",
                analytics: "Analiză",
                platformConfig: "Configurare Platformă",
                security: "Securitate",
                settings: "Setări",
                administrator: "Administrator",
                signOut: "Deconectare"
            },
            footer: {
                platformName: "Platforma Universitară",
                allRightsReserved: "Toate drepturile rezervate",
                privacy: "Politica de Confidențialitate",
                terms: "Termeni și Condiții",
                contact: "Contact"
            },
            legal: {
                privacy: {
                    title: "Politica de Confidențialitate",
                    lastUpdated: "Ultima actualizare: 26 octombrie 2025",
                    body: `## Colectarea Informațiilor

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Utilizarea Datelor

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Drepturile Tale

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
                },
                terms: {
                    title: "Termeni și Condiții",
                    lastUpdated: "Ultima actualizare: 26 octombrie 2025",
                    body: `## Acceptare

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.

## Obligații Utilizator

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.

## Încetare

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.`
                },
                contact: {
                    title: "Contactează-ne",
                    description: "Ia legătura cu noi prin oricare dintre canalele de mai jos.",
                    emailLabel: "Email",
                    email: "contact@platforma-universitara.ro",
                    phoneLabel: "Telefon",
                    phone: "+40 123 456 789",
                    addressLabel: "Adresă",
                    address: "Cluj-Napoca, România"
                }
            }
        }
    },
    email: {
        verification: {
            from: "Platforma Universitară",
            subject: "Verifică-ți Adresa de Email",
            greeting: "Bună",
            body: "Îți mulțumim pentru înregistrare! Te rugăm să îți verifici adresa de email dând click pe butonul de mai jos.",
            buttonText: "Verifică Email",
            orCopy: "Sau copiază și lipește acest link în browserul tău:",
            expiry: "Acest link va expira în 24 de ore.",
            ignore: "Dacă nu ai creat un cont, poți ignora cu siguranță acest email."
        },
        welcome: {
            from: "Platforma Universitară",
            subject: "Bun venit pe Platforma Universitară",
            greeting: "Bun venit",
            body: "Emailul tău a fost verificat! Acum poți accesa toate funcționalitățile platformei.",
            buttonText: "Mergi la Dashboard"
        },
        passwordReset: {
            from: "Platforma Universitară",
            subject: "Resetează-ți Parola",
            greeting: "Bună",
            body: "Am primit o solicitare de resetare a parolei. Dă click pe butonul de mai jos pentru a seta o parolă nouă.",
            buttonText: "Resetează Parola",
            orCopy: "Sau copiază și lipește acest link în browserul tău:",
            expiry: "Acest link va expira într-o oră.",
            ignore: "Dacă nu ai solicitat o resetare a parolei, poți ignora cu siguranță acest email."
        }
    },
    errors: {
        validation: {
            nameMinLength: "Numele trebuie să aibă cel puțin 2 caractere",
            invalidEmail: "Adresă de email invalidă",
            passwordMinLength: "Parola trebuie să aibă cel puțin 8 caractere",
            passwordRequired: "Parola este obligatorie",
            emailRequired: "Emailul este obligatoriu",
            missingFields: "Câmpuri obligatorii lipsă"
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
            notAuthenticated: "Trebuie să fii autentificat",
            userNotFound: "Utilizator negăsit",
            alreadyVerified: "Emailul este deja verificat",
            tooManyAttempts: "Prea multe încercări de autentificare. Te rugăm să încerci din nou în {minutes} minute.",
            tooManySignups: "Prea multe încercări de înregistrare. Te rugăm să încerci din nou în {minutes} minute.",
            tooManyResetRequests: "Prea multe cereri de resetare a parolei. Te rugăm să încerci din nou în {minutes} minute.",
            tooManyResendAttempts: "Prea multe încercări de retrimiteri. Te rugăm să încerci din nou în {minutes} minute.",
            resendFailed: "Trimiterea emailului de verificare a eșuat. Te rugăm să încerci din nou."
        },
        email: {
            verificationFailed: "Trimiterea emailului de verificare a eșuat",
            resetFailed: "Trimiterea emailului de resetare a eșuat"
        }
    },
    success: {
        auth: {
            resetEmailSent: "Dacă există un cont cu acest email, un link de resetare a fost trimis",
            verificationEmailSent: "Dacă există un cont cu acest email, un link de verificare a fost trimis"
        }
    }
} as const;
