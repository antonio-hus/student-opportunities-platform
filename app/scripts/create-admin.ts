/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Node Libraries
import readline from 'node:readline'
import { Writable } from 'node:stream'
// Prisma Libraries
import { PrismaClient, UserRole } from '@prisma/client'
// Project Libraries
import { hashPassword } from '@/src/utils/password-hash'


/////////////////////////////
///       CONSTANTS       ///
/////////////////////////////
const prisma = new PrismaClient()


/////////////////////////////
///        HELPERS        ///
/////////////////////////////
class MutedStdout extends Writable {
    public muted = false

    _write(
        chunk: any,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void
    ) {
        if (!this.muted) {
            process.stdout.write(chunk, encoding)
        }
        callback()
    }
}

function ask(question: string, { silent = false } = {}): Promise<string> {
    if (!silent) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        })

        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close()
                resolve(answer.trim())
            })
        })
    }

    // Silent (password) input:
    // 1. Write the question prompt to real stdout FIRST
    process.stdout.write(question)

    // 2. Create muted stream and readline interface
    const mutedStdout = new MutedStdout()
    mutedStdout.muted = true

    const rl = readline.createInterface({
        input: process.stdin,
        output: mutedStdout,
        terminal: true,
    })

    return new Promise((resolve) => {
        // Pass empty string as question since we already printed it
        rl.question('', (answer) => {
            rl.close()
            // Move to next line after password input
            process.stdout.write('\n')
            resolve(answer.trim())
        })
    })
}


/////////////////////////////
///        SCRIPT         ///
/////////////////////////////
async function main() {
    const email = await ask('Admin email: ')
    const name = await ask('Admin name (optional): ')
    const password = await ask('Admin password: ', { silent: true })

    if (!email || !password) {
        console.error('Email and password are required.')
        process.exit(1)
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.upsert({
        where: { email },
        update: {
            name: name || undefined,
            role: UserRole.ADMINISTRATOR,
            isActive: true,
            isSuspended: false,
        },
        create: {
            email,
            name: name || null,
            hashedPassword,
            role: UserRole.ADMINISTRATOR,
            emailVerified: new Date(),
            isActive: true,
            isSuspended: false,
        },
    })

    console.log('Admin account created/updated.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
    .catch(async (err) => {
        console.error('Failed to create admin:', err)
        await prisma.$disconnect()
        process.exit(1)
    })
