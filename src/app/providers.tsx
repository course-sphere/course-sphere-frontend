'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { authClient } from '@/lib/api-client';

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            redirectTo={process.env.NEXT_PUBLIC_APP_URL}
            emailVerification={true}
            social={{
                providers: ['google', 'microsoft', 'github'],
            }}
            onSessionChange={() => {
                router.refresh();
            }}
            Link={Link}
        >
            {children}
        </AuthUIProvider>
    );
}
