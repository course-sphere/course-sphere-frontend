'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, ClipboardX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { PaginationControl } from '@/components/ui/pagination-control';
import { CourseCard } from '@/components/course-card';
import type { PaginationState } from '@tanstack/react-table';
import { categories, levels } from '@constant/sample-data';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetAllCourses, CourseResponse } from '@/lib/service/course';

const MOCK_FREE_COURSE: CourseResponse = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Introduction to Generative AI & ChatGPT',
    subtitle: 'Master the basics of Prompt Engineering and AI tooling.',
    description:
        'A comprehensive guide for beginners to start using AI to boost productivity.',
    status: 'approved',
    level: 'beginner',
    price: 0,
    total: 12,
    total_required: 12,
    thumbnail_url:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
    categories: ['Technology', 'AI'],
    instructor: {
        id: 'inst-1',
        name: 'Andrew Ng',
        email: 'andrew@example.com',
        image: 'https://i.pravatar.cc/150?u=andrew',
    },
};

const MOCK_PAID_COURSE: CourseResponse = {
    id: 'c90a1b6a-9631-4475-b82b-030910f54508',
    title: 'Advanced Microservices with Go & gRPC',
    subtitle: 'Build highly scalable and distributed systems.',
    description:
        'Learn how to architect, develop, and deploy enterprise-grade microservices.',
    status: 'approved',
    level: 'advanced',
    price: 99000,
    total: 35,
    total_required: 30,
    thumbnail_url:
        'https://images.unsplash.com/photo-1616222584144-8df634f19b9e?auto=format&fit=crop&q=80&w=600',
    categories: ['Software Engineering', 'Backend'],
    instructor: {
        id: 'inst-2',
        name: 'Alex Developer',
        email: 'alex@example.com',
        image: 'https://i.pravatar.cc/150?u=alex',
    },
};
export default function AllCoursesPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 8,
        pageIndex: 0,
    });

    const { data: apiCourses = [], isLoading: isApiLoading } =
        useGetAllCourses();

    const allCourses = useMemo(() => {
        return [MOCK_FREE_COURSE, MOCK_PAID_COURSE, ...apiCourses];
    }, [apiCourses]);

    const [isPending, setIsPending] = useState(false);
    const debouncedSearch = useDebounce(search, 400);

    const showLoading = isPending || isApiLoading;

    useEffect(() => {
        const startTimer = setTimeout(() => setIsPending(true), 0);
        const stopTimer = setTimeout(() => setIsPending(false), 400);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(stopTimer);
        };
    }, [debouncedSearch, selectedCategory, selectedLevel]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleLevelChange = (value: string) => {
        setSelectedLevel(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const { paginatedCourses, totalElements, totalApprovedCourses } =
        useMemo(() => {
            const visibleCourses = allCourses.filter(
                (course) =>
                    course.status === 'approved' ||
                    course.status === 'reviewing',
            );

            const filtered = visibleCourses.filter((course) => {
                const matchesSearch =
                    course.title
                        ?.toLowerCase()
                        .includes(debouncedSearch.toLowerCase()) ||
                    (course.instructor?.name || '')
                        .toLowerCase()
                        .includes(debouncedSearch.toLowerCase());

                const matchesCategory =
                    selectedCategory === 'all' ||
                    (course.categories &&
                        course.categories.includes(selectedCategory));

                const matchesLevel =
                    selectedLevel === 'all' || course.level === selectedLevel;

                return matchesSearch && matchesCategory && matchesLevel;
            });

            const start = pagination.pageIndex * pagination.pageSize;
            const end = start + pagination.pageSize;

            return {
                paginatedCourses: filtered.slice(start, end),
                totalElements: filtered.length,
                totalApprovedCourses: visibleCourses.length,
            };
        }, [
            allCourses,
            debouncedSearch,
            selectedCategory,
            selectedLevel,
            pagination.pageIndex,
            pagination.pageSize,
        ]);

    return (
        <div className="bg-background min-h-screen">
            <section className="bg-background bg-linear-to-b px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="space-y-6 text-center">
                        <Badge className="mx-auto">
                            <BookOpen className="mr-2 h-4 w-4" />
                            All Courses
                        </Badge>
                        <h1 className="text-foreground text-4xl font-bold text-balance sm:text-5xl">
                            Expand Your Skills with {totalApprovedCourses}+
                            Courses
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Learn from industry experts. Browse our complete
                            catalog of courses across web development, data
                            science, design, and more.
                        </p>

                        <div className="mx-auto mt-8 max-w-md">
                            <div className="relative" role="search">
                                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                                <Input
                                    type="search"
                                    placeholder="Search by course title or instructor..."
                                    className="bg-background/70 focus:border-primary rounded-xl py-6 pl-12 text-base shadow-sm"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-8 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-foreground text-2xl font-bold">
                                Course Catalog
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                {showLoading
                                    ? 'Loading results...'
                                    : `Showing ${totalElements} courses`}
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Select
                                value={selectedCategory}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="w-full rounded-lg sm:w-45">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedLevel}
                                onValueChange={handleLevelChange}
                            >
                                <SelectTrigger className="w-full rounded-lg sm:w-45">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    {levels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="min-h-[50vh]">
                        {showLoading ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {Array.from({
                                    length: pagination.pageSize,
                                }).map((_, i) => (
                                    <CourseCard key={i} isLoading />
                                ))}
                            </div>
                        ) : paginatedCourses.length === 0 ? (
                            <div className="mx-auto max-w-7xl rounded-md border border-dashed py-16">
                                <EmptyState
                                    className="mx-auto"
                                    title="No courses found"
                                    description="Try adjusting your search or filters to find what you're looking for."
                                    icons={[Search, ClipboardX, BookOpen]}
                                    action={{
                                        label: 'Clear all filters',
                                        onClick: () => {
                                            setSearch('');
                                            setSelectedCategory('all');
                                            setSelectedLevel('all');
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex: 0,
                                            }));
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {paginatedCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {totalElements > 0 && !showLoading && (
                        <div className="mt-12 flex justify-center">
                            <PaginationControl
                                itemCount={totalElements}
                                pagination={pagination}
                                setPagination={setPagination}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
