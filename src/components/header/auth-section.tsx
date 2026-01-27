'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthSection() {
    return (
        <>
            <Button size="sm" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" variant="secondary" asChild>
                <Link href="/auth/sign-up">Create account</Link>
            </Button>
        </>
    );
}
