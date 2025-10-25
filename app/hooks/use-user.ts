"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { useEffect, useState } from "react"

/////////////////////////////
///     HOOKS SECTION     ///
/////////////////////////////
// Hook to fetch and manage current user state from API
export function useUser() {
    // State management
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Fetch user data on mount
    useEffect(() => {
        fetch("/api/user")
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    // Return user data and loading state
    return { user, loading }
}
