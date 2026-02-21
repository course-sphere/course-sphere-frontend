import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header
                items={[
                    { label: 'Courses', href: '/course' },
                    { label: 'Roadmaps', href: '/roadmap' },
                ]}
            />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}