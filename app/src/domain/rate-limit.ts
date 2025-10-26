/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////


/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
export type RateLimit = {
    // Unique identifier for the rate-limited resource (e.g., IP address, user ID, API key)
    token: string;
    // Current number of requests made within the rate limit window
    count: number;
    // Maximum number of requests allowed within the rate limit window
    limit: number;
    // Unix timestamp (in milliseconds) when the rate limit counter resets
    resetAt: number;
};