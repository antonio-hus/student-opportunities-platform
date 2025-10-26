/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import bcrypt from "bcryptjs"

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Salt rounds for bcrypt hashing (12 rounds = high security, reasonable performance)
const SALT_ROUNDS = 12

/////////////////////////////
///  PASSWORD MANAGEMENT  ///
/////////////////////////////
// Hash a plain text password using bcrypt
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

// Verify a plain text password against a hashed password
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}
