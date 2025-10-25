/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Prisma Libraries
import { PrismaClient } from '@prisma/client'

/////////////////////////////
///     PRISMA CLIENT     ///
/////////////////////////////
// Singleton factory function to create PrismaClient instance
const prismaClientSingleton = () => {
    return new PrismaClient({log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],})
}

// Extend global scope to store Prisma instance
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

/////////////////////////////
///    PRISMA INSTANCE    ///
/////////////////////////////
// Use existing global instance or create new one (prevents multiple instances in development)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Store instance globally in development to prevent connection issues during hot reload
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}

// Export instance
export default prisma
