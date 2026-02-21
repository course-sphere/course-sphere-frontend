'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Role } from '@/lib/service/user';
import { RoleCheckingLoader } from '../ui/role-checking-loader';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isCheckingAuth) {
            if (!isAuthenticated) {
                router.replace('/unauthorized');
            } else if (user && !allowedRoles.includes(user.role)) {
                router.replace('/forbidden');
            }
        }
    }, [isCheckingAuth, isAuthenticated, user, allowedRoles, router]);

    if (
        isCheckingAuth ||
        !isAuthenticated ||
        (user && !allowedRoles.includes(user.role))
    ) {
        return <RoleCheckingLoader />;
    }

    return <>{children}</>;
}
