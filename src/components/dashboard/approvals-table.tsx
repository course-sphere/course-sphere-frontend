'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Eye, Sparkles, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios-config';
import {
    AIEvaluationResult,
    ApprovalRequest,
    CourseDetailResponse,
    CourseStatusNew,
} from '@/lib/service/course';
import { fetchAIEvaluation } from '@constant/sample-data';

import { ConfirmDialog } from '../confirm-dialog';
import { RejectCourseDialog } from '../reject-course-dialog';
import { AIEvaluationSheet } from '../ai-evaluation-sheet';

interface Props {
    requests: ApprovalRequest[];
}

export function ApprovalsTable({ requests }: Props) {
    const queryClient = useQueryClient();
    const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(
        null,
    );
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);

    const [, setEvaluatingId] = useState<string | null>(null);
    const [aiResults, setAiResults] = useState<
        Record<string, AIEvaluationResult>
    >({});

    // Xóa cái state "tà đạo" hiddenIds đi nhé haha!

    // Mutation cập nhật status thật dưới DB
    const updateStatusMutation = useMutation<
        CourseDetailResponse,
        Error,
        { id: string; status: CourseStatusNew }
    >({
        mutationFn: async ({ id, status }) => {
            return await apiClient.patch<
                CourseDetailResponse,
                CourseDetailResponse,
                { status: CourseStatusNew }
            >(`/course/${id}`, { status });
        },
        onSuccess: () => {
            // Ép React Query load lại danh sách course, tự động filter lại UI
            queryClient.invalidateQueries({ queryKey: ['all-courses'] });
        },
    });

    const handleApprove = async () => {
        if (!selectedReq) return;

        try {
            await updateStatusMutation.mutateAsync({
                id: selectedReq.courseId,
                status: 'approved',
            });
            toast.success(
                `Course "${selectedReq.courseTitle}" successfully approved and published!`,
            );
            setIsApproveOpen(false);
            setSelectedReq(null);
        } catch (error) {
            console.error('Error approving course:', error);
            toast.error('Failed to approve course. Please try again.');
        }
    };

    const handleReject = async () => {
        if (!selectedReq) return;

        try {
            await updateStatusMutation.mutateAsync({
                id: selectedReq.courseId,
                status: 'removed', // Hoặc 'rejected' nếu backend ông định nghĩa thế
            });
            toast.success(
                `Course "${selectedReq.courseTitle}" has been rejected.`,
            );
            setIsRejectOpen(false);
            setSelectedReq(null);
        } catch (error) {
            console.error('Error rejecting course:', error);
            toast.error('Failed to reject course. Please try again.');
        }
    };

    const handleAIEvaluate = async (courseId: string) => {
        setEvaluatingId(courseId);
        const result = await fetchAIEvaluation(courseId);
        setAiResults((prev) => ({ ...prev, [courseId]: result }));
        setEvaluatingId(null);
    };

    const handleViewAIResult = (req: ApprovalRequest) => {
        setSelectedReq(req);
        setIsAiSheetOpen(true);
    };

    return (
        <div className="border-border/60 bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-87.5 py-4">
                                Course Details
                            </TableHead>
                            <TableHead className="py-4">Instructor</TableHead>
                            <TableHead className="py-4">Submitted</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4 text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow
                                key={req.id}
                                className="group hover:bg-muted/10 transition-colors"
                            >
                                <TableCell className="py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-muted relative h-14 w-20 shrink-0 overflow-hidden rounded-md shadow-sm">
                                            <Image
                                                src={req.thumbnail}
                                                alt={req.courseTitle}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex max-w-55 flex-col gap-1">
                                            <span className="text-foreground truncate leading-tight font-semibold">
                                                {req.courseTitle}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {req.category}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-5">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 rounded-md shadow-sm">
                                            <AvatarImage
                                                src={req.instructorAvatar}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary rounded-md text-xs font-medium">
                                                {req.instructorName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {req.instructorName}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {req.instructorEmail}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground py-5 text-sm">
                                    {new Date(
                                        req.submittedAt,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-5">
                                    <Badge
                                        variant="outline"
                                        className="border-amber-500/20 bg-amber-500/10 py-1 text-amber-600"
                                    >
                                        {req.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground h-9 rounded-lg"
                                        >
                                            <Link
                                                href={`/course/${req.courseId}`}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                View
                                            </Link>
                                        </Button>

                                        {aiResults[req.courseId] ? (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleViewAIResult(req)
                                                }
                                                className="h-9 rounded-lg bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700"
                                            >
                                                <FileText className="mr-1.5 h-4 w-4" />{' '}
                                                Result Ready
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleAIEvaluate(
                                                        req.courseId,
                                                    )
                                                }
                                                className="h-9 rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                            >
                                                <Sparkles className="mr-1.5 h-4 w-4" />{' '}
                                                AI Check
                                            </Button>
                                        )}

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-lg text-emerald-600 transition-colors hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-500 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400"
                                            onClick={() => {
                                                setSelectedReq(req);
                                                setIsApproveOpen(true);
                                            }}
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-lg text-rose-600 transition-colors hover:bg-rose-500/20 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
                                            onClick={() => {
                                                setSelectedReq(req);
                                                setIsRejectOpen(true);
                                            }}
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDialog
                open={isApproveOpen}
                onOpenChangeAction={setIsApproveOpen}
                title="Approve Course"
                loading={updateStatusMutation.isPending}
                description={`Are you sure you want to approve "${selectedReq?.courseTitle}"? It will be published to the catalog immediately.`}
                confirmText="Approve & Publish"
                onConfirmAction={handleApprove}
            />
            <RejectCourseDialog
                open={isRejectOpen}
                onOpenChange={setIsRejectOpen}
                courseTitle={selectedReq?.courseTitle || ''}
                onConfirm={handleReject}
            />

            <AIEvaluationSheet
                open={isAiSheetOpen}
                onOpenChange={setIsAiSheetOpen}
                data={selectedReq ? aiResults[selectedReq.courseId] : null}
                courseTitle={selectedReq?.courseTitle || ''}
            />
        </div>
    );
}
