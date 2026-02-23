'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleNavMenu } from '@/components/layout/role-nav-menu';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { RoleCheckingLoader } from '@/components/ui/role-checking-loader';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated) {
            router.replace('/');
        }
    }, [isCheckingAuth, isAuthenticated, router]);

    if (isCheckingAuth || !isAuthenticated || !user) {
        return <RoleCheckingLoader />;
    }

    return (
        <DashboardLayout
            title="Account Management"
            sidebarContent={<RoleNavMenu role={user.role} />}
        >
            {children}
        </DashboardLayout>
    );
}
