/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
import { PrismaClient } from '@prisma/client'


/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Database singleton initializer
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

// Global type declaration for Prisma instance
// Prevents TypeScript errors when storing in globalThis
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Singleton Prisma Client instance
// Uses global instance in development to prevent connection pool exhaustion
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Store instance globally in development
// Prevents multiple instances during Next.js hot reload
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}

// Export singleton instance
export default prisma
