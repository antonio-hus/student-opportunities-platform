"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useEffect } from 'react'
// Next Libraries
import { useRouter } from 'next/navigation'
// Project Libraries
import { useAuth } from '@/lib/auth/context'

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Show nothing while redirecting
    if (!user) {
        return null
    }

    // Render children if authenticated
    return <>{children}</>
}
