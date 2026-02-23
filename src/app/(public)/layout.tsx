'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { RoleCheckingLoader } from '@/components/ui/role-checking-loader';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isCheckingAuth, isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const isErrorPage =
        pathname === '/forbidden' || pathname === '/unauthorized';

    useEffect(() => {
        if (!isCheckingAuth && isAuthenticated && user) {
            if (pathname === '/forbidden' || pathname === '/unauthorized') {
                return;
            }
            switch (user.role) {
                case 'instructor':
                case 'admin':
                    router.replace('/dashboard');
                    break;
                default:
                    router.replace('/course');
                    break;
            }
        }
    }, [isCheckingAuth, isAuthenticated, user, router]);

    if (isCheckingAuth) {
        return <RoleCheckingLoader />;
    }

    if (isAuthenticated && !isErrorPage) {
        return <RoleCheckingLoader />;
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
