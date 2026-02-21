import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
            <Lock className="h-20 w-20 text-amber-500" />
            <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
            <p className="text-muted-foreground">
                Please login to use this feature
            </p>
            <Link href="/" className="text-primary hover:underline">
                Go home
            </Link>
        </div>
    );
}
