import { Grid2x2PlusIcon } from 'lucide-react';

export function Icon() {
    return (
        <div className="flex items-center gap-2">
            <Grid2x2PlusIcon className="size-5" />
            <p className="font-mono text-base font-bold">CS</p>
        </div>
    );
}
