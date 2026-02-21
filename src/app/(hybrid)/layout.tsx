'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleNavMenu } from '@/components/layout/role-nav-menu';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { RoleCheckingLoader } from '@/components/ui/role-checking-loader';

export default function HybridLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return <RoleCheckingLoader />;
    }

    if (isAuthenticated && user) {
        return (
            <DashboardLayout
                title="Course Sphere"
                sidebarContent={<RoleNavMenu role={user.role} />}
            >
                {children}
            </DashboardLayout>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header
                items={[
                    { label: 'Courses', href: '/course' },
                    { label: 'Roadmaps', href: '/roadmap' },
                ]}
            />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
