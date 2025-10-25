import { RequireRole } from '@/components/auth/require-role'
import {UserRole} from "@/lib/types";

export default function AdminPage() {
    return (
        <RequireRole roles={[UserRole.ADMINISTRATOR]}>
            <div>Admin content</div>
        </RequireRole>
    )
}
