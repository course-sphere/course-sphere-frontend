'use client';

import { useState, useMemo } from 'react';
import {
    Search,
    Map,
    ChevronRight,
    BookOpen,
    Route,
    MapPin,
} from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useDebounce } from '@/hooks/use-debounce';
import {
    RoadmapAggregated,
    useGetAllRoadmapsAggregated,
} from '@/lib/service/roadmap';

const MOCK_ROADMAPS: RoadmapAggregated[] = [
    {
        id: 'mock-1',
        author_id: 'author-1',
        position: 1,
        title: 'Frontend Developer Masterclass',
        description:
            'Step-by-step guide to becoming a modern Frontend Engineer in 2026. Covers React, Next.js, Tailwind, and State Management.',
        courseIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
        courseCount: 6,
    },
    {
        id: 'mock-2',
        author_id: 'author-2',
        position: 2,
        title: 'Backend Engineering with Go',
        description:
            'Master scalable backend systems, microservices, and high-performance APIs using Golang and PostgreSQL.',
        courseIds: ['c7', 'c8', 'c9', 'c10', 'c11'],
        courseCount: 5,
    },
    {
        id: 'mock-3',
        author_id: 'author-3',
        position: 3,
        title: 'DevOps & Cloud Architect',
        description:
            'From zero to deploying scalable infrastructure. Learn Docker, Kubernetes, AWS, and CI/CD pipelines.',
        courseIds: ['c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18'],
        courseCount: 7,
    },
    {
        id: 'mock-4',
        author_id: 'author-4',
        position: 4,
        title: 'Fullstack Next.js Developer',
        description:
            'The complete path to building full-stack applications with Next.js App Router, Prisma, and tRPC.',
        courseIds: ['c19', 'c20', 'c21', 'c22'],
        courseCount: 4,
    },
    {
        id: 'mock-5',
        author_id: 'author-5',
        position: 5,
        title: 'UI/UX Design Foundation',
        description:
            'Learn the principles of user interface and user experience design. Master Figma and design systems.',
        courseIds: ['c23', 'c24', 'c25'],
        courseCount: 3,
    },
    {
        id: 'mock-6',
        author_id: 'author-6',
        position: 6,
        title: 'Data Science & Machine Learning',
        description:
            'Dive into Python, Pandas, Scikit-learn, and build real-world ML models from scratch.',
        courseIds: ['c26', 'c27', 'c28', 'c29', 'c30', 'c31'],
        courseCount: 6,
    },
];

export default function RoadmapExplorerPage() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data: apiRoadmaps = [], isLoading } = useGetAllRoadmapsAggregated();

    const filteredRoadmaps = useMemo(() => {
        const validApiRoadmaps = apiRoadmaps.filter(
            (rm) =>
                rm.title &&
                rm.title.toLowerCase() !== 'string' &&
                rm.title.length > 4,
        );

        const sourceData =
            validApiRoadmaps.length > 0 ? validApiRoadmaps : MOCK_ROADMAPS;

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
            <section className="bg-muted/30 border-border relative overflow-hidden border-b">
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-12">
                    <div className="bg-primary/5 h-96 w-96 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-6 text-center">
                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 mx-auto"
                        >
                            <Map className="mr-2 h-4 w-4" />
                            Learning Pathways
                        </Badge>
                        <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Master Your Career Path
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Stop wandering. Follow structured learning paths
                            curated by industry experts and reach your career
                            goals efficiently.
                        </p>

                        <div className="relative mx-auto mt-8 max-w-md">
                            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Search roadmaps (e.g. Backend, DevOps)..."
                                className="bg-background focus:border-primary rounded-xl py-6 pl-12 text-base shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-foreground text-2xl font-bold">
                        Available Roadmaps
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        {isLoading
                            ? 'Discovering pathways...'
                            : `${filteredRoadmaps.length} pathways found`}
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-muted/60 border-border/50 h-[280px] w-full animate-pulse rounded-2xl border"
                            />
                        ))}
                    </div>
                ) : filteredRoadmaps.length === 0 ? (
                    <EmptyState
                        className="py-16"
                        title="No roadmaps found"
                        description="We couldn't find any learning paths matching your search criteria."
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
                            >
                                <div className="group bg-card border-border hover:border-primary/50 relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                    {/* Dashed line decor */}
                                    <div className="border-border/50 group-hover:border-primary/30 absolute top-0 right-0 bottom-0 w-8 border-l border-dashed opacity-50 transition-colors" />

                                    <div className="mb-5 flex items-start justify-between">
                                        <div className="bg-primary/10 text-primary rounded-xl p-3 shadow-xs">
                                            <Route className="h-6 w-6" />
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="bg-background text-xs font-bold tracking-wide"
                                        >
                                            {roadmap.courseCount} Courses
                                        </Badge>
                                    </div>

                                    <h3 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 text-xl font-extrabold transition-colors">
                                        {roadmap.title}
                                    </h3>

                                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 text-sm leading-relaxed font-medium">
                                        {roadmap.description ||
                                            'No description provided for this roadmap. Dive in to explore the courses!'}
                                    </p>

                                    <div className="border-border/60 mt-auto flex items-center justify-between border-t pt-5">
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                                            <BookOpen className="text-primary/70 h-4 w-4" />
                                            <span>Structured Path</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="group-hover:bg-primary group-hover:text-primary-foreground rounded-full font-bold shadow-xs transition-all"
                                        >
                                            Explore
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
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
