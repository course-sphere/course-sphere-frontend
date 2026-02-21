import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RoleNavMenu } from '@/components/layout/role-nav-menu';

export default async function CourseDomainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const mockSession = {
        user: {
            name: 'Đặng Phương Nam',
            email: 'namdangcoder@gmail.com',
            role: 'TEACHER',
        },
    };

    if (mockSession.user.role !== 'TEACHER') {
        return <div>Hello world</div>;
    }

    return (
        <DashboardLayout
            title="Course Builder"
            sidebarContent={<RoleNavMenu role="TEACHER" />}
        >
            {children}
        </DashboardLayout>
    );
}
