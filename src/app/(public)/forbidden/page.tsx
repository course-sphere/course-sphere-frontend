'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';

export default function ForbiddenPage() {
    const router = useRouter();
    const { user, isCheckingAuth } = useAuthStore();

    const handleGoHome = () => {
        if (!user) {
            router.replace('/');
            return;
        }

        switch (user.role) {
            case 'instructor':
            case 'admin':
                router.replace('/dashboard');
                break;
            case 'student':
                router.replace('/course');
                break;
            default:
                router.replace('/');
        }
    };

    if (isCheckingAuth) return null;

    return (
        <div className="bg-background flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10">
                <ShieldAlert className="h-12 w-12 text-rose-500" />
            </div>

            <h1 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight">
                403 - Access Denied
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                Oops! You don't have permission to access this page. It looks
                like you've wandered into a restricted area.
            </p>

            <Button
                onClick={handleGoHome}
                size="lg"
                className="h-12 rounded-xl px-8 text-base shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
                <Home className="mr-2 h-5 w-5" />
                Take Me Home
            </Button>
        </div>
    );
}
