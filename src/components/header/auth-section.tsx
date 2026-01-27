import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthSection() {
    return (
        <>
            <Button size="sm" asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" variant="secondary" asChild>
                <Link href="/auth/register">Register</Link>
            </Button>
        </>
    );
}
