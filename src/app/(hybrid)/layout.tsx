'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleNavMenu } from '@/components/layout/role-nav-menu';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { RoleCheckingLoader } from '@/components/ui/role-checking-loader';
import { usePathname } from 'next/navigation';

export default function HybridLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const pathname = usePathname();

    if (isCheckingAuth) {
        return <RoleCheckingLoader />;
    }
    const isLearnRoute = pathname.includes('/learn');
    const isPreviewRoute = pathname.includes('/preview');

    if (isAuthenticated && user) {
        if (isLearnRoute || isPreviewRoute) {
            return <>{children}</>;
        }
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
