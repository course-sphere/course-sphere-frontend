'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideLayout = pathname.includes('/course/create');
    return (
        <>
            {!hideLayout && (
                <Header
                    items={[
                        {
                            label: 'Courses',
                            href: '/course',
                        },
                        {
                            label: 'Roadmaps',
                            href: '/roadmap',
                        },
                    ]}
                />
            )}
            {children}
            {!hideLayout && <Footer />}
            <Toaster />
        </>
    );
}
