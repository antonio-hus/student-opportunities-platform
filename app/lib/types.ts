/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Re-export everything from Prisma Client
export type {
    User,
    Student,
    Coordinator,
    Organization,
    Administrator,
    Project,
    Application,
    ProjectCompletion,
    PlatformConfiguration,
    VerificationToken,
    PasswordResetToken,
} from '@prisma/client'

// Re-export all enums
export {
    UserRole,
    OrganizationType,
    ApplicationStatus,
    ProjectStatus,
} from '@prisma/client'
