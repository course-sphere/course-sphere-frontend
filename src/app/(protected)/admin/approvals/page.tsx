'use client';

import { useState, useMemo } from 'react';
import {
    Search,
    FileCheck,
    CheckCircle2,
    Bot,
    Ghost,
    Loader2,
} from 'lucide-react';
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

import {
    ApprovalStatus,
    useGetAllCourses,
    ApprovalRequest,
    CourseResponse,
} from '@/lib/service/course';
import StatCard from '@/components/stat-card';
import { ApprovalsTable } from '@/components/dashboard/approvals-table';

// Helper to map backend course status to UI approval status
const mapCourseStatusToApproval = (courseStatus: string): ApprovalStatus => {
    if (courseStatus === 'approved') return 'approved';
    if (courseStatus === 'rejected' || courseStatus === 'removed')
        return 'rejected';
    // 'reviewing' or 'ai-approved' are considered pending for the admin
    return 'pending';
};

export default function AdminApprovalsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>(
        'pending',
    );

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });

    const { data: allCourses = [], isLoading } = useGetAllCourses();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: ApprovalStatus | 'all') => {
        setStatusFilter(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const { paginatedRequests, totalElements, pendingCount, approvedCount } =
        useMemo(() => {
            // Filter out drafts and removed courses from the review queue
            const reviewableCourses = allCourses.filter(
                (c) => c.status !== 'draft' && c.status !== 'removed',
            );

            // Calculate accurate stats based on real backend statuses
            const pending = reviewableCourses.filter(
                (c) => c.status === 'reviewing' || c.status === 'ai-approved',
            ).length;

            const approved = reviewableCourses.filter(
                (c) => c.status === 'approved',
            ).length;

            const filtered = reviewableCourses.filter((course) => {
                const matchesSearch =
                    (course.title || '')
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (course.instructor?.name || '')
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                const mappedStatus = mapCourseStatusToApproval(course.status);

                let matchesStatus = false;
                if (statusFilter === 'all') {
                    matchesStatus = true;
                } else if (statusFilter === mappedStatus) {
                    matchesStatus = true;
                }

                return matchesSearch && matchesStatus;
            });

            const start = pagination.pageIndex * pagination.pageSize;
            const paginated = filtered
                .slice(start, start + pagination.pageSize)
                .map(
                    (course): ApprovalRequest => ({
                        id: course.id,
                        courseId: course.id,
                        courseTitle: course.title,
                        thumbnail:
                            course.thumbnail_url ||
                            'https://fakeimg.pl/600x400/cccccc/909090?text=No+Cover',
                        category:
                            (course.categories && course.categories[0]) ||
                            'Uncategorized',
                        instructorName:
                            course.instructor?.name ||
                            course.instructor?.displayUsername ||
                            'Unknown',
                        instructorEmail: course.instructor?.email || 'N/A',
                        instructorAvatar: course.instructor?.image || '',
                        submittedAt:
                            (course as CourseResponse & { updated_at?: string })
                                .updated_at || new Date().toISOString(),
                        status: mapCourseStatusToApproval(course.status),
                    }),
                );

            return {
                paginatedRequests: paginated,
                totalElements: filtered.length,
                pendingCount: pending,
                approvedCount: approved,
            };
        }, [
            allCourses,
            searchQuery,
            statusFilter,
            pagination.pageIndex,
            pagination.pageSize,
        ]);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-10">
            <div>
                <h1 className="text-foreground text-3xl font-bold">
                    Content Governance
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review and manage course submissions from instructors.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    title="Pending Requests"
                    value={pendingCount.toString()}
                    change="Needs your attention"
                    icon={<FileCheck className="h-6 w-6" />}
                />
                <StatCard
                    title="Approved This Week"
                    value={approvedCount.toString()}
                    change="Up to date"
                    icon={<CheckCircle2 className="h-6 w-6" />}
                />
                <StatCard
                    title="Avg. AI Score"
                    value="86/100"
                    change="Based on AI Evaluation"
                    icon={<Bot className="h-6 w-6" />}
                />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="relative w-full sm:max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search by course or instructor..."
                        className="bg-background border-border/60 w-full rounded-xl pl-9 focus-visible:ring-1"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="bg-background border-border/60 w-full rounded-xl sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Submissions</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                {paginatedRequests.length > 0 ? (
                    <>
                        <ApprovalsTable requests={paginatedRequests} />
                        {totalElements > pagination.pageSize && (
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
                        title="No submissions found"
                        description="There are currently no course requests matching your filters."
                        icons={[Ghost, FileCheck]}
                        className="bg-card mt-8"
                    />
                )}
            </div>
        </div>
    );
}
