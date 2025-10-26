/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Project Libraries
import { User } from './user';

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
export type SessionData = {
    // The authenticated user's data
    user: User;
    // Authentication status flag indicating if the session is valid
    isAuth: boolean;
    // Unix timestamp (in milliseconds) when the session was created
    createdAt: number;
    // Unix timestamp (in milliseconds) when the session expires
    expiresAt: number;
}