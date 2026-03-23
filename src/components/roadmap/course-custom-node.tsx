'use client';

import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { CourseNodeData } from '@/lib/stores/use-roadmap-store';

export function CourseCustomNode({ data }: { data: CourseNodeData }) {
    return (
        <div className="bg-card ring-border/50 w-68 overflow-hidden rounded-2xl border shadow-sm ring-1 transition-all hover:shadow-md">
            <Handle
                type="target"
                position={Position.Left}
                className="border-background bg-primary h-3 w-3 border-2"
            />

            <div className="p-4">
                <div className="flex gap-3">
                    <div className="bg-muted relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image
                            src={data.thumbnail || '/placeholder.jpg'}
                            alt={data.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-[10px]">
                                {data.category}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                                {data.level}
                            </Badge>
                        </div>

                        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-semibold">
                            {data.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                            by {data.instructor}
                        </p>
                    </div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="border-background bg-primary h-3 w-3 border-2"
            />
        </div>
    );
}
