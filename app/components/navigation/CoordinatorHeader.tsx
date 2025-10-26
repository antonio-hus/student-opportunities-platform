'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import {
    LayoutDashboard,
    ClipboardCheck,
    Users,
    Briefcase,
    FileCheck,
    User,
    Settings
} from 'lucide-react'
// Project Libraries
import BaseHeader, { BaseHeaderProps } from './BaseHeader'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
type CoordinatorHeaderProps = Omit<BaseHeaderProps, 'navItems' | 'userIcon' | 'roleLabel' | 'translationKey'>


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function CoordinatorHeader({ user }: CoordinatorHeaderProps) {
    const navItems = [
        {
            href: '/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/dashboard/reviews',
            label: 'Project Reviews',
            icon: ClipboardCheck,
            exact: false,
        },
        {
            href: '/dashboard/applications',
            label: 'Student Applications',
            icon: Users,
            exact: false,
        },
        {
            href: '/dashboard/supervised',
            label: 'Supervised Projects',
            icon: Briefcase,
            exact: false,
        },
        {
            href: '/dashboard/evaluations',
            label: 'Evaluations',
            icon: FileCheck,
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
            roleLabel="Coordinator"
            translationKey="pages.navigation.coordinator"
        />
    )
}
