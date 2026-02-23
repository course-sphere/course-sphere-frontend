'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
    Edit,
    Eye,
    ShieldAlert,
    XCircle,
    Users,
    CircleDollarSign,
    Trash2,
} from 'lucide-react';
import { CourseStatus, InstructorCourse } from '@/lib/service/course';

interface Props {
    course: InstructorCourse;
}

const statusConfig: Record<CourseStatus, { color: string; label: string }> = {
    draft: { color: 'bg-muted text-muted-foreground', label: 'Draft' },
    pending: {
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        label: 'Pending Review',
    },
    published: {
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        label: 'Published',
    },
    rejected: {
        color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        label: 'Rejected',
    },
    approved: {
        color: 'bg-green-500/10 text-green-600 border-green-500/20',
        label: 'Approved',
    },
};

export function InstructorCourseCard({ course }: Props) {
    const config = statusConfig[course.status];

    return (
        <Card className="border-border/60 flex flex-col overflow-hidden transition-all hover:shadow-md sm:flex-row">
            <div className="bg-muted relative h-48 shrink-0 sm:h-auto sm:w-64">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="text-xs font-normal"
                            >
                                {course.category}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`border text-xs ${config.color}`}
                            >
                                {config.label}
                            </Badge>
                        </div>
                        <h3 className="text-foreground line-clamp-1 text-xl font-bold">
                            {course.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Last updated:{' '}
                            {new Date(course.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-auto sm:pt-4">
                    {course.status === 'draft' && (
                        <>
                            <Button asChild size="sm">
                                <Link href={`/course/create?id=${course.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Continue
                                    Editing
                                </Link>
                            </Button>
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/preview?materialId=${course.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {course.status === 'pending' && (
                        <>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/preview?materialId=${course.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                    Preview
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Cancel
                                Request
                            </Button>
                        </>
                    )}

                    {course.status === 'published' && (
                        <>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/preview?materialId=${course.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Course
                                </Link>
                            </Button>
                        </>
                    )}

                    {course.status === 'rejected' && (
                        <>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => alert(course.rejectReason)}
                            >
                                <ShieldAlert className="mr-2 h-4 w-4" /> View
                                Reason
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/course/create?id=${course.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Fix Issues
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-muted/10 border-border/50 flex flex-row items-center justify-around border-t p-4 sm:w-48 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l sm:p-6">
                <div className="flex flex-col items-center text-center">
                    <span className="text-foreground text-xl font-bold">
                        {course.students.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground flex items-center text-xs font-medium tracking-wider uppercase">
                        <Users className="mr-1 h-3 w-3" /> Students
                    </span>
                </div>
                <div className="bg-border/50 hidden h-px w-full sm:my-4 sm:block" />
                <div className="flex flex-col items-center text-center">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ${course.revenue.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground flex items-center text-xs font-medium tracking-wider uppercase">
                        <CircleDollarSign className="mr-1 h-3 w-3" /> Revenue
                    </span>
                </div>
            </div>
        </Card>
    );
}
