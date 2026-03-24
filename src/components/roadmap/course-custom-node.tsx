'use client';

import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import {
    CourseNodeData,
    useRoadmapStore,
} from '@/lib/stores/use-roadmap-store';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export function CourseCustomNode({
    id,
    data,
    selected,
}: {
    id: string;
    data: CourseNodeData;
    selected?: boolean;
}) {
    const removeNode = useRoadmapStore((state) => state.removeNode);

    return (
        <div
            className={cn(
                'group bg-card relative w-70 overflow-hidden rounded-xl border transition-all',
                selected
                    ? 'border-primary ring-primary shadow-md ring-1'
                    : 'border-border shadow-sm hover:shadow-md',
            )}
        >
            <button
                onClick={() => removeNode(id)}
                className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 z-10 rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                title="Remove course"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
            <Handle
                type="target"
                position={Position.Left}
                className={cn(
                    'border-background z-20 -ml-3! h-6! w-6! cursor-crosshair rounded-full border-4 transition-all hover:scale-125',
                    selected
                        ? 'bg-primary'
                        : 'bg-muted-foreground/40 hover:bg-primary shadow-sm',
                )}
            />
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="bg-muted border-border/50 relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border">
                        <Image
                            src={data.thumbnailUrl || '/placeholder.jpg'}
                            alt={data.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2 pr-6">
                            {data.categories && data.categories[0] && (
                                <Badge
                                    variant="secondary"
                                    className="max-w-25 truncate text-[10px] font-medium"
                                >
                                    {data.categories[0]}
                                </Badge>
                            )}
                            <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-wider uppercase">
                                {data.level}
                            </span>
                        </div>
                        <h3
                            className="text-foreground line-clamp-2 pr-2 text-sm leading-snug font-semibold"
                            title={data.title}
                        >
                            {data.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                            by {data.instructorName}
                        </p>
                    </div>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className={cn(
                    'border-background z-20 -mr-3! h-6! w-6! cursor-crosshair rounded-full border-4 transition-all hover:scale-125',
                    selected
                        ? 'bg-primary'
                        : 'bg-muted-foreground/40 hover:bg-primary shadow-sm',
                )}
            />{' '}
        </div>
    );
}
