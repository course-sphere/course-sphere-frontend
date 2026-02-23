'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="bg-background flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/10">
                <Lock className="h-12 w-12 text-amber-500" />
            </div>

            <h1 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight">
                401 - Unauthorized
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                Halt! You need to be logged in to view this content. Please sign
                in to verify your identity.
            </p>

            <Button
                onClick={() => router.replace('/')}
                size="lg"
                className="h-12 rounded-xl px-8 text-base font-semibold shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
                <LogIn className="mr-2 h-5 w-5" />
                Return to Login
            </Button>
        </div>
    );
}
