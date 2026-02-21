import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
            <ShieldAlert className="text-destructive h-20 w-20" />
            <h1 className="text-4xl font-bold">403 - Access Denied</h1>
            <p className="text-muted-foreground">
                You do not have enough authorization
            </p>
            <Link href="/" className="text-primary hover:underline">
                Go home
            </Link>
        </div>
    );
}
