/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import prisma from '@/src/database'
import { hashPassword } from '@/src/utils/password-hash'
import { UserRole } from '@prisma/client'

/////////////////////////////
///    SEED FUNCTION      ///
/////////////////////////////
async function seedTestUsers() {
    console.log('🌱 Starting test user seeding...\n')

    // Hash password once for all users
    const hashedPassword = await hashPassword('Test1234')

    // Define test users
    const testUsers = [
        {
            email: 'student@test.com',
            name: 'Test Student',
            role: UserRole.STUDENT,
        },
        {
            email: 'coordinator@test.com',
            name: 'Test Coordinator',
            role: UserRole.COORDINATOR,
        },
        {
            email: 'organization@test.com',
            name: 'Test Organization',
            role: UserRole.ORGANIZATION,
        },
        {
            email: 'admin@test.com',
            name: 'Test Administrator',
            role: UserRole.ADMINISTRATOR,
        },
    ]

    // Create users
    for (const userData of testUsers) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email },
            })

            if (existingUser) {
                console.log(`⏭️  User already exists: ${userData.email}`)
                continue
            }

            // Create user
            await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    hashedPassword,
                    role: userData.role,
                    emailVerified: new Date(),
                    isActive: true,
                    isSuspended: false,
                },
            })

            console.log(`✅ Created ${userData.role}: ${userData.email}`)
        } catch (error) {
            console.error(`❌ Failed to create ${userData.email}:`, error)
        }
    }

    console.log('\n🎉 Test user seeding completed!')
    console.log('\n📝 Login credentials:')
    console.log('   Email: [role]@test.com')
    console.log('   Password: Test1234')
}

/////////////////////////////
///    EXECUTION BLOCK    ///
/////////////////////////////
seedTestUsers()
    .then(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
    .catch(async (error) => {
        console.error('\n💥 Seeding failed:', error)
        await prisma.$disconnect()
        process.exit(1)
    })
