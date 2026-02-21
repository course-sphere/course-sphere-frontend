'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { authClient } from '@/lib/api-client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/providers/auth-provider';

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            redirectTo={process.env.NEXT_PUBLIC_APP_URL}
            avatar={true}
            deleteUser={{
                verification: true,
            }}
            nameRequired={true}
            emailVerification={true}
            twoFactor={['totp']}
            social={{
                providers: ['google', 'microsoft', 'github'],
            }}
            onSessionChange={() => {
                router.refresh();
            }}
            Link={Link}
        >
            <AuthProvider>
                <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
            </AuthProvider>
        </AuthUIProvider>
    );
}
