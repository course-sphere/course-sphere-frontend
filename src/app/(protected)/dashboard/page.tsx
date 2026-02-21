'use client';

import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { InstructorDashboard } from '@/components/dashboard/instructor-dashboard';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isCheckingAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isCheckingAuth && user?.role === 'student') {
            router.replace('/forbidden');
        }
    }, [user, isCheckingAuth, router]);

    if (isCheckingAuth || !user) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            {user.role === 'admin' && <AdminDashboard />}
            {user.role === 'instructor' && <InstructorDashboard />}
        </div>
    );
}
