'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    PlusCircle,
    Search,
    BookOpen,
    Users,
    DollarSign,
    SearchX,
    FileQuestion,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { PaginationState } from '@tanstack/react-table';
import { CourseStatus } from '@/lib/service/course';
import { mockInstructorCourses } from '@constant/sample-data';
import { InstructorCourseCard } from '@/components/instructor-course-card';
import StatCard from '@/components/stat-card';

export default function TeacherCoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>(
        'all',
    );

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: CourseStatus | 'all') => {
        setStatusFilter(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const totalCourses = mockInstructorCourses.length;
    const activeStudents = mockInstructorCourses.reduce(
        (sum, c) => sum + c.students,
        0,
    );
    const totalRevenue = mockInstructorCourses.reduce(
        (sum, c) => sum + c.revenue,
        0,
    );

    const { paginatedCourses, totalElements } = useMemo(() => {
        const filtered = mockInstructorCourses.filter((course) => {
            const matchesSearch = course.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' || course.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;

        return {
            paginatedCourses: filtered.slice(start, end),
            totalElements: filtered.length,
        };
    }, [searchQuery, statusFilter, pagination.pageIndex, pagination.pageSize]);

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-foreground text-3xl font-bold">
                        My Courses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your courses, track performance, and handle
                        reviews.
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-xl shadow-md">
                    <Link href="/course/create">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create Course
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    title="Total Courses"
                    value={totalCourses.toString()}
                    change="+1 this month"
                    icon={<BookOpen className="h-6 w-6" />}
                />
                <StatCard
                    title="Active Students"
                    value={activeStudents.toLocaleString()}
                    change="+12% vs last month"
                    icon={<Users className="h-6 w-6" />}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    change="+5% vs last month"
                    icon={<DollarSign className="h-6 w-6" />}
                />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="relative w-full sm:max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search courses..."
                        className="bg-background w-full rounded-xl pl-9"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="bg-background w-full rounded-xl sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                {paginatedCourses.length > 0 ? (
                    <>
                        {paginatedCourses.map((course) => (
                            <InstructorCourseCard
                                key={course.id}
                                course={course}
                            />
                        ))}

                        {totalElements > 0 && (
                            <div className="mt-8 flex justify-center">
                                <PaginationControl
                                    itemCount={totalElements}
                                    pagination={pagination}
                                    setPagination={setPagination}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        title="No courses found"
                        description="Try adjusting your search or filter to find what you're looking for."
                        icons={[SearchX, Search, FileQuestion]}
                        className="mt-8"
                    />
                )}
            </div>
        </div>
    );
}
