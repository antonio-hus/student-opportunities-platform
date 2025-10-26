'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import {
    LayoutDashboard,
    Search,
    Briefcase,
    FileText,
    GraduationCap,
    User,
    Settings
} from 'lucide-react'
// Project Libraries
import BaseHeader, { BaseHeaderProps } from './BaseHeader'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
type StudentHeaderProps = Omit<BaseHeaderProps, 'navItems' | 'userIcon' | 'roleLabel' | 'translationKey'>


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function StudentHeader({ user }: StudentHeaderProps) {
    const navItems = [
        {
            href: '/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/dashboard/discover',
            label: 'Discover',
            icon: Search,
            exact: false,
        },
        {
            href: '/dashboard/applications',
            label: 'Applications',
            icon: FileText,
            exact: false,
        },
        {
            href: '/dashboard/projects',
            label: 'My Projects',
            icon: Briefcase,
            exact: false,
        },
        {
            href: '/dashboard/portfolio',
            label: 'Portfolio',
            icon: GraduationCap,
            exact: false,
        },
        {
            href: '/dashboard/profile',
            label: 'Profile',
            icon: User,
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
            userIcon={User}
            roleLabel="Student"
            translationKey="pages.navigation.student"
        />
    )
}
