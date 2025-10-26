'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    Shield,
    BarChart3,
    Settings,
    Palette
} from 'lucide-react'
// Project Libraries
import BaseHeader, { BaseHeaderProps } from './BaseHeader'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
type AdminHeaderProps = Omit<BaseHeaderProps, 'navItems' | 'userIcon' | 'roleLabel' | 'translationKey'>


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function AdminHeader({ user }: AdminHeaderProps) {
    const navItems = [
        {
            href: '/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/dashboard/users',
            label: 'User Management',
            icon: Users,
            exact: false,
        },
        {
            href: '/dashboard/organizations',
            label: 'Organizations',
            icon: Building2,
            exact: false,
        },
        {
            href: '/dashboard/projects',
            label: 'Project Moderation',
            icon: Briefcase,
            exact: false,
        },
        {
            href: '/dashboard/analytics',
            label: 'Analytics',
            icon: BarChart3,
            exact: false,
        },
        {
            href: '/dashboard/platform',
            label: 'Platform Config',
            icon: Palette,
            exact: false,
        },
        {
            href: '/dashboard/security',
            label: 'Security',
            icon: Shield,
            exact: false,
        },
        {
            href: '/dashboard/settings',
            label: 'Settings',
            icon: Settings,
            exact: false,
        },
    ]

    return (
        <BaseHeader
            user={user}
            navItems={navItems}
            userIcon={Shield}
            roleLabel="Administrator"
            translationKey="pages.navigation.admin"
        />
    )
}
