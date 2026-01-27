import { Grid2x2PlusIcon } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
    return (
        <div className="flex items-center gap-2 text-blue-700">
            <Grid2x2PlusIcon className={className} />
            <p className="font-mono text-base font-bold">CS</p>
        </div>
    );
}
