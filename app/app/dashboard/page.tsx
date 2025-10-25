import { RequireAuth } from '@/components/auth/require-auth'

export default function DashboardPage() {
    return (
        <RequireAuth>
            <div>Dashboard content</div>
        </RequireAuth>
    )
}
