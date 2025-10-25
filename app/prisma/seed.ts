/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

/////////////////////////////
///    PRISMA CLIENT     ///
/////////////////////////////
const prisma = new PrismaClient()

/////////////////////////////
///   MAIN SEED FUNCTION  ///
/////////////////////////////
async function main() {
    console.log('Seeding database...')

    // Create or update platform configuration with university settings
    const config = await prisma.platformConfiguration.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            universityName: 'Babeș-Bolyai University',
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            studentEmailDomain: '@stud.ubbcluj.ro',
            staffEmailDomain: '@ubbcluj.ro',
            requireOrgVerification: true,
            requireProjectApproval: true,
            enablePortfolioFeature: true,
        },
    })

    console.log('Platform configuration created')

    /////////////////////////////
    ///   ADMIN USER CREATION ///
    /////////////////////////////
    // Hash admin password (12 rounds for security)
    const hashedPassword = await bcrypt.hash('admin', 12)

    // Create or update admin user with administrator profile
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@ubbcluj.ro' },
        update: {},
        create: {
            email: 'admin@ubbcluj.ro',
            hashedPassword,
            role: UserRole.ADMINISTRATOR,
            name: 'System Administrator',
            emailVerified: new Date(),
            isActive: true,
            administrator: {
                create: {
                    department: 'IT Administration',
                    permissions: ['MANAGE_USERS', 'MANAGE_PROJECTS', 'MANAGE_CONFIG'],
                },
            },
        },
    })

    console.log('Admin user created:', adminUser.email)

    console.log('Seeding completed!')
}

/////////////////////////////
///  EXECUTION & CLEANUP  ///
/////////////////////////////
main()
    .catch((e) => {
        console.error('Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
