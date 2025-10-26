'use client'

/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import { useState } from 'react'
// Next Libraries
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// Third-party Libraries
import { Menu, X, LogOut, LucideIcon } from 'lucide-react'
// Project Libraries
import { signOut } from '@/src/controller/auth-controller'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
export type NavItem = {
    href: string
    label: string
    icon: LucideIcon
    exact: boolean
}

export type BaseHeaderProps = {
    user: {
        id: string
        name: string | null
        email: string
        profilePictureUrl: string | null
    }
    navItems: NavItem[]
    userIcon: LucideIcon
    roleLabel: string
    translationKey: string
}


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function BaseHeader({user, navItems, userIcon: UserIcon, roleLabel, translationKey}: BaseHeaderProps) {
    const tMeta = useTranslations('metadata')
    const t = useTranslations(translationKey)
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isActiveLink = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo / Brand */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <UserIcon className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="hidden font-semibold text-text-primary md:inline-block">
                                {tMeta('platformName')}
                            </span>
                        </Link>

                        {/* Desktop Navigation - Only show first 5 items */}
                        <nav className="hidden lg:block">
                            <ul className="flex items-center gap-1">
                                {navItems.slice(0, 5).map((item) => {
                                    const isActive = isActiveLink(item.href, item.exact)
                                    const Icon = item.icon

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">
                            {/* User Info - Desktop Only */}
                            <div className="hidden items-center gap-2 lg:flex">
                                {user.profilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt={user.name || roleLabel}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <UserIcon className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                                <div className="max-w-[150px]">
                                    <p className="truncate text-sm font-medium text-text-primary">
                                        {user.name || roleLabel}
                                    </p>
                                </div>
                            </div>

                            {/* Sign Out - Desktop */}
                            <button
                                onClick={handleSignOut}
                                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary lg:flex"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t('signOut')}</span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-elevated lg:hidden"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu - Full Screen from Left */}
            <div
                className={`fixed left-0 top-0 z-50 h-full w-full transform bg-surface transition-transform duration-300 ease-in-out sm:w-80 lg:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between border-b border-border p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <UserIcon className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-semibold text-text-primary">
                                {tMeta('platformName')}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-elevated"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="border-b border-border p-4">
                        <div className="flex items-center gap-3">
                            {user.profilePictureUrl ? (
                                <img
                                    src={user.profilePictureUrl}
                                    alt={user.name || roleLabel}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-base font-semibold text-text-primary">
                                    {user.name || roleLabel}
                                </p>
                                <p className="truncate text-sm text-text-secondary">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = isActiveLink(item.href, item.exact)
                                const Icon = item.icon

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 rounded-md px-4 py-3 transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-base font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Sign Out Button */}
                    <div className="border-t border-border p-4">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-base font-medium">{t('signOut')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
