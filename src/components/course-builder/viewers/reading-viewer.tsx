'use client';

import { LearnMaterialContent } from '@/lib/service/lesson';
import { Clock, BookOpen } from 'lucide-react';

interface ReadingViewerProps {
    material: LearnMaterialContent;
}

export function ReadingViewer({ material }: ReadingViewerProps) {
    const readingData = material.reading_data;

    if (!readingData) {
        return (
            <div className="text-muted-foreground bg-muted/20 rounded-xl border p-8 text-center">
                Content is missing or corrupted.
            </div>
        );
    }

    return (
        <div className="bg-background mx-auto w-full max-w-4xl rounded-xl p-2 sm:p-6 lg:p-8">
            <div className="text-muted-foreground border-border/50 mb-8 flex items-center gap-6 border-b pb-6 text-sm">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-primary h-4 w-4" />
                    <span className="text-foreground font-medium">
                        Reading Article
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingData.duration} min read</span>
                </div>
            </div>

            <article
                className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:shadow-md prose-pre:bg-muted/50 prose-pre:text-foreground prose-pre:border prose-pre:border-border max-w-none"
                dangerouslySetInnerHTML={{ __html: readingData.content }}
            />
        </div>
    );
}
