import { Loader2, ShieldCheck } from 'lucide-react';

export function RoleCheckingLoader() {
    return (
        <div className="bg-background flex h-screen w-full flex-col items-center justify-center space-y-6">
            <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="bg-primary/20 absolute h-full w-full animate-ping rounded-full"></div>
                <div className="bg-primary/10 relative z-10 flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm">
                    <ShieldCheck className="text-primary h-8 w-8" />
                </div>
                <Loader2 className="text-primary absolute h-20 w-20 animate-spin opacity-50" />
            </div>

            <div className="space-y-2 text-center">
                <h3 className="text-foreground text-xl font-semibold">
                    Checking permissions...{' '}
                </h3>
                <p className="text-muted-foreground animate-pulse text-sm">
                    Please waiting a second...
                </p>
            </div>
        </div>
    );
}
