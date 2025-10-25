"use client"

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React, { useEffect } from 'react'
// Next Libraries
import { useRouter } from 'next/navigation'
// Next-intl Libraries
import { useTranslations } from 'next-intl'
// Project Libraries
import { useAuth } from '@/lib/auth/context'
import { UserRole } from "@/lib/types"

/////////////////////////////
///    TYPE DEFINITIONS   ///
/////////////////////////////
type RequireRoleProps = {
    roles: UserRole[]
    children: React.ReactNode
    fallback?: React.ReactNode
}

/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
    const t = useTranslations('pages.auth.accessControl')
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

    // Redirect if not authenticated
    if (!user) {
        return null
    }

    // Check if user has required role
    const hasRole = roles.includes(user.role)

    if (!hasRole) {
        // Show fallback or default unauthorized message
        if (fallback) {
            return <>{fallback}</>
        }

        return (
            <div className="container max-w-md mx-auto py-16 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4 text-text-primary">
                    {t('accessDenied')}
                </h1>
                <p className="text-text-secondary mb-8">
                    {t('noPermission')}
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-lg"
                >
                    {t('goToDashboard')}
                </button>
            </div>
        )
    }

    // Render children if user has required role
    return <>{children}</>
}
