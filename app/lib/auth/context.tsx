"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
// Next Libraries
import { useRouter, usePathname } from 'next/navigation'
// Project Libraries
import type { User } from '@/lib/types'

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
interface AuthContextType {
    user: User | null
    loading: boolean
    refreshAuth: () => Promise<void>
}

/////////////////////////////
///   CONTEXT CREATION    ///
/////////////////////////////
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/////////////////////////////
///   PROVIDER COMPONENT  ///
/////////////////////////////
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const fetchUser = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch('/api/auth/session')

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else if (response.status === 401) {
                // Session expired
                setUser(null)
                router.push('/login?expired=true')
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [router, pathname])

    // Initial fetch
    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    // Periodic session check (every 5 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUser()
        }, 5 * 60 * 1000) // 5 minutes

        return () => clearInterval(interval)
    }, [fetchUser])

    // Check session on visibility change (when user returns to tab)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchUser()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [fetchUser])

    const value = {
        user,
        loading,
        refreshAuth: fetchUser,  // Now matches Promise<void>
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/////////////////////////////
///   CUSTOM HOOK         ///
/////////////////////////////
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
