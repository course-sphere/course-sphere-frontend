'use client';

import { useState, useMemo } from 'react';
import { Search, Map, Route, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetAllRoadmapsAggregated } from '@/lib/service/roadmap';

export default function RoadmapExplorerPage() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data: apiRoadmaps = [], isLoading } = useGetAllRoadmapsAggregated();

    const filteredRoadmaps = useMemo(() => {
        const sourceData = apiRoadmaps.filter(
            (rm) =>
                rm.title &&
                rm.title.toLowerCase() !== 'string' &&
                rm.title.length > 4,
        );

        if (!debouncedSearch) return sourceData;

        return sourceData.filter(
            (rm) =>
                rm.title
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase()) ||
                rm.description
                    ?.toLowerCase()
                    .includes(debouncedSearch.toLowerCase()),
        );
    }, [apiRoadmaps, debouncedSearch]);

    return (
        <div className="bg-background min-h-screen">
            {/* HERO SECTION - Thu nhỏ font size và khoảng cách */}
            <section className="relative overflow-hidden pt-12 pb-10">
                <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [bg-size:16px_16px] dark:bg-black dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)]" />
                <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary/15 h-64 w-150 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl space-y-6 text-center">
                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 mx-auto px-3 py-1 text-xs"
                        >
                            <Map className="mr-2 h-3.5 w-3.5" />
                            Learning Pathways
                        </Badge>
                        <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Master Your{' '}
                            <span className="text-primary">Career Path</span>
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-xl text-base">
                            Stop wandering. Follow structured learning paths
                            curated by industry experts and reach your goals.
                        </p>

                        <div className="relative mx-auto mt-8 max-w-md">
                            <div className="bg-background/80 focus-within:ring-primary focus-within:border-primary border-border/50 relative flex items-center overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all focus-within:ring-2">
                                <div className="text-muted-foreground pr-2 pl-4">
                                    <Search className="h-4 w-4" />
                                </div>
                                <Input
                                    type="search"
                                    placeholder="Search roadmaps..."
                                    className="h-12 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="border-border/50 mb-8 flex items-center justify-between border-b pb-4">
                    <h2 className="text-foreground text-2xl font-bold tracking-tight">
                        Available Roadmaps
                    </h2>
                    <div className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-semibold">
                        {isLoading ? '...' : `${filteredRoadmaps.length} paths`}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-muted/40 border-border/50 h-64 w-full animate-pulse rounded-2xl border"
                            />
                        ))}
                    </div>
                ) : filteredRoadmaps.length === 0 ? (
                    <EmptyState
                        className="py-12"
                        title="No roadmaps found"
                        description="Try a different search term."
                        icons={[MapPin, Route, Search]}
                        action={{
                            label: 'Clear search',
                            onClick: () => setSearch(''),
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRoadmaps.map((roadmap) => (
                            <Link
                                key={roadmap.id}
                                href={`/roadmap/${roadmap.id}`}
                                className="group"
                            >
                                <div className="bg-card border-border hover:border-primary/50 flex h-64 flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-3 transition-colors">
                                            <Route className="h-6 w-6" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-muted text-foreground/80 px-2.5 py-0.5 text-[10px] font-bold uppercase"
                                        >
                                            {roadmap.courseCount} Courses
                                        </Badge>
                                    </div>
                                    <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-lg font-bold transition-colors">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
                                        {roadmap.description ||
                                            'Explore the courses in this curated path.'}
                                    </p>
                                    <div className="text-primary mt-auto flex items-center text-sm font-bold">
                                        Explore Pathway{' '}
                                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
