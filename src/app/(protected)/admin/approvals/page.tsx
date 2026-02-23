'use client';

// ============================================================================
// TODO: API Integration
// 1. Endpoint: GET /api/v1/admin/approvals
// 2. Query Params: search, status (pending/history), page, limit
// ============================================================================

import { useState, useMemo } from 'react';
import { Search, FileCheck, CheckCircle2, Bot, Ghost } from 'lucide-react';
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
import { ApprovalStatus } from '@/lib/service/course';
import { mockApprovals } from '@constant/sample-data';
import StatCard from '@/components/stat-card';
import { ApprovalsTable } from '@/components/dashboard/approvals-table';

export default function AdminApprovalsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>(
        'pending',
    );

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: ApprovalStatus | 'all') => {
        setStatusFilter(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const pendingCount = mockApprovals.filter(
        (r) => r.status === 'pending',
    ).length;
    const approvedCount = mockApprovals.filter(
        (r) => r.status === 'approved',
    ).length;

    const { paginatedRequests, totalElements } = useMemo(() => {
        const filtered = mockApprovals.filter((req) => {
            const matchesSearch =
                req.courseTitle
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                req.instructorName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' || req.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const start = pagination.pageIndex * pagination.pageSize;
        return {
            paginatedRequests: filtered.slice(
                start,
                start + pagination.pageSize,
            ),
            totalElements: filtered.length,
        };
    }, [searchQuery, statusFilter, pagination.pageIndex, pagination.pageSize]);

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
                    change="+12% vs last week"
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
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                {paginatedRequests.length > 0 ? (
                    <>
                        <ApprovalsTable requests={paginatedRequests} />
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
