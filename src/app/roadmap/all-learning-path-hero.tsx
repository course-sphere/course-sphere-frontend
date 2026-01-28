'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function AllLearningPathsHero() {
    return (
        <section className="from-primary/5 to-background bg-linear-to-b px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="space-y-6 text-center">
                    <Badge className="mx-auto">Learning Paths</Badge>
                    <h1 className="text-foreground text-4xl font-bold text-balance sm:text-5xl">
                        Structured Paths to Mastery
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Follow carefully curated learning paths designed by
                        industry experts to take you from beginner to advanced
                        in your chosen field.
                    </p>

                    <div className="mx-auto mt-8 max-w-md">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                            <Input
                                placeholder="Search learning paths..."
                                className="py-3 pl-10 text-base"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
