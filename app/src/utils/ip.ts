/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { headers } from 'next/headers'

/////////////////////////////
///   HELPER  FUNCTIONS   ///
/////////////////////////////
export async function getClientIp(): Promise<string> {
    const headersList = await headers()

    // Check various headers for real IP (in order of priority)
    const forwarded = headersList.get('x-forwarded-for')
    const real = headersList.get('x-real-ip')

    // Cloudflare
    const cfConnecting = headersList.get('cf-connecting-ip')

    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, get the first one
        return forwarded.split(',')[0].trim()
    }

    if (real) {
        return real
    }

    if (cfConnecting) {
        return cfConnecting
    }

    // Fallback to a default (shouldn't happen in production)
    return 'unknown'
}
