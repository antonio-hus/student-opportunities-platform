'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import {
    LayoutDashboard,
    Briefcase,
    Users,
    BarChart3,
    Settings,
    Building2
} from 'lucide-react'
// Project Libraries
import BaseHeader, { BaseHeaderProps } from './BaseHeader'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
type OrganizationHeaderProps = Omit<BaseHeaderProps, 'navItems' | 'userIcon' | 'roleLabel' | 'translationKey'>


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function OrganizationHeader({ user }: OrganizationHeaderProps) {
    const navItems = [
        {
            href: '/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/dashboard/projects',
            label: 'Projects',
            icon: Briefcase,
            exact: false,
        },
        {
            href: '/dashboard/applications',
            label: 'Applications',
            icon: Users,
            exact: false,
        },
        {
            href: '/dashboard/analytics',
            label: 'Analytics',
            icon: BarChart3,
            exact: false,
        },
        {
            href: '/dashboard/profile',
            label: 'Profile',
            icon: Building2,
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
            userIcon={Building2}
            roleLabel="Organization"
            translationKey="pages.navigation.organization"
        />
    )
}
