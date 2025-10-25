/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import { LRUCache } from 'lru-cache'

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
type RateLimitOptions = {
    // Time window in milliseconds
    interval: number
    // Max unique IPs/emails to track
    uniqueTokenPerInterval: number
}

/////////////////////////////
///   RATE LIMITER CLASS  ///
/////////////////////////////
export class RateLimiter {
    private tokenCache: LRUCache<string, number[]>

    constructor(options: RateLimitOptions) {
        this.tokenCache = new LRUCache({
            max: options.uniqueTokenPerInterval || 500,
            ttl: options.interval || 60000,
        })
    }

    check(limit: number, token: string): { success: boolean; remaining: number; reset: number } {
        const tokenCount = this.tokenCache.get(token) || [0]
        const currentUsage = tokenCount[0]

        if (currentUsage >= limit) {
            return {
                success: false,
                remaining: 0,
                reset: Date.now() + (this.tokenCache.ttl || 60000),
            }
        }

        tokenCount[0] += 1
        this.tokenCache.set(token, tokenCount)

        return {
            success: true,
            remaining: limit - tokenCount[0],
            reset: Date.now() + (this.tokenCache.ttl || 60000),
        }
    }
}

// Login rate limiter: 5 attempts per 15 minutes per IP
export const loginLimiter = new RateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
})

// Signup rate limiter: 3 signups per hour per IP
export const signupLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
})

// Password reset limiter: 3 requests per hour per IP
export const passwordResetLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
})

// Email verification resend: 3 per hour per email
export const emailResendLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
})
