'use client';

import { useEffect } from 'react';
import { authClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: sessionData, isPending } = authClient.useSession();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (!isPending) {
            if (sessionData?.user) {
                const currentUser =
                    sessionData.user as typeof sessionData.user & {
                        role: 'student' | 'instructor' | 'admin';
                    };
                setAuth({
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    image: currentUser.image ?? null,
                    role: currentUser.role,
                });
            } else {
                setAuth(null);
            }
        }
    }, [sessionData, isPending, setAuth]);

    return <>{children}</>;
}
