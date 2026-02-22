'use client';

import { useState, use } from 'react';
import {
    Play,
    BookOpen,
    HelpCircle,
    Code as CodeIcon,
    FileText,
    Lock,
    ChevronDown,
    Users,
    Award,
    Globe,
    Check,
    Star,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { notFound, useRouter } from 'next/navigation';

import { CourseDetailResponse } from '@/lib/service/course';
import {
    CourseSyllabusResponse,
    MaterialItemType,
} from '@/lib/service/syllabus/type';
import { mockCourseDetail, mockStudentSyllabus } from '@constant/sample-data';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { formatVideoDuration } from '@/lib/utils';

const materialIconMap: Record<MaterialItemType, React.ElementType> = {
    video: Play,
    reading: BookOpen,
    quiz: HelpCircle,
    coding: CodeIcon,
    file: FileText,
};

interface CoursePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CoursePage({ params }: CoursePageProps) {
    const { id } = use(params);
    const router = useRouter();
    console.log(id);

    const course: CourseDetailResponse = mockCourseDetail;
    const syllabus: CourseSyllabusResponse = mockStudentSyllabus;

    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

    // TODO: Call API to check whether the login user is bought the cousrse yet
    // const isEnrolled = await checkUserEnrollment(id);
    const isEnrolled = false;

    const [expandedModules, setExpandedModules] = useState<string[]>(
        syllabus?.modules?.[0] ? [syllabus.modules[0].id] : [],
    );

    if (!course) {
        notFound();
    }

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((mId) => mId !== moduleId)
                : [...prev, moduleId],
        );
    };

    const totalMaterials =
        syllabus?.modules?.reduce(
            (acc, mod) =>
                acc +
                mod.lessons.reduce(
                    (lAcc, les) => lAcc + les.materials.length,
                    0,
                ),
            0,
        ) || 0;
    const isDiscounted =
        course.discount_price > 0 && course.discount_price < course.price;

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="border-border border-b bg-slate-900 py-12 text-slate-50 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="flex items-center gap-3">
                                {course.category?.map((cat) => (
                                    <Badge
                                        key={cat.id}
                                        variant="secondary"
                                        className="border-none bg-slate-800 text-slate-200 hover:bg-slate-700"
                                    >
                                        {cat.text}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
                                {course.title}
                            </h1>
                            <p className="text-lg text-pretty text-slate-300">
                                {course.subtitle}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
                                {course.rating && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-current"
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-1 font-semibold text-white">
                                            {course.rating}
                                        </span>
                                        <span>
                                            (
                                            {course.rating_count?.toLocaleString()}{' '}
                                            ratings)
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {course.enrolled_students?.toLocaleString()}
                                        + students
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span className="capitalize">
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="space-y-12 lg:col-span-2">
                        {course.learning_objectives &&
                            course.learning_objectives.length > 0 && (
                                <div className="border-border bg-card rounded-xl border p-6 shadow-sm md:p-8">
                                    <h2 className="mb-6 text-2xl font-bold">
                                        What you'll learn
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {course.learning_objectives.map(
                                            (obj, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex gap-3"
                                                >
                                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                                    <span className="text-muted-foreground text-sm">
                                                        {obj}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                        {course.requirements &&
                            course.requirements.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-2xl font-bold">
                                        Requirements
                                    </h2>
                                    <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                        {course.requirements.map((req, idx) => (
                                            <li key={idx}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        <div>
                            <h2 className="mb-4 text-2xl font-bold">
                                Description
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {course.description}
                            </p>
                        </div>

                        <div>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-2xl font-bold">
                                    Course Curriculum
                                </h2>
                                <span className="text-muted-foreground text-sm">
                                    {syllabus?.modules?.length || 0} modules •{' '}
                                    {totalMaterials} items
                                </span>
                            </div>

                            <div className="space-y-4">
                                {syllabus?.modules?.map((module) => {
                                    const isExpanded = expandedModules.includes(
                                        module.id,
                                    );
                                    return (
                                        <Card
                                            key={module.id}
                                            className="border-border overflow-hidden shadow-sm"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleModule(module.id)
                                                }
                                                className="hover:bg-muted/50 flex w-full items-center justify-between p-4 transition-colors"
                                            >
                                                <div className="flex flex-col text-left">
                                                    <h3 className="text-base font-semibold">
                                                        {module.title}
                                                    </h3>
                                                    <span className="text-muted-foreground mt-1 text-sm">
                                                        {module.lessons.length}{' '}
                                                        lessons
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    className={`text-muted-foreground h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {isExpanded && (
                                                <div className="border-border bg-muted/30 border-t px-4 py-3">
                                                    {module.lessons?.map(
                                                        (lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                className="py-3"
                                                            >
                                                                <h4 className="text-foreground/90 mb-3 text-sm font-medium">
                                                                    {
                                                                        lesson.title
                                                                    }
                                                                </h4>
                                                                <div className="border-border/60 ml-2 space-y-1.5 border-l-2 pl-4">
                                                                    {lesson.materials?.map(
                                                                        (
                                                                            material,
                                                                        ) => {
                                                                            const MaterialIcon =
                                                                                materialIconMap[
                                                                                    material
                                                                                        .item_type
                                                                                ];
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        material.id
                                                                                    }
                                                                                    className="group hover:bg-background hover:border-border/50 flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        <MaterialIcon className="text-muted-foreground h-4 w-4" />
                                                                                        <span
                                                                                            className={`text-sm ${isEnrolled && material.is_completed ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}
                                                                                        >
                                                                                            {
                                                                                                material.title
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        {material.is_preview &&
                                                                                            !isEnrolled && (
                                                                                                <Badge
                                                                                                    variant="outline"
                                                                                                    className="bg-primary/5 text-primary border-primary/20 text-[10px] tracking-wider uppercase"
                                                                                                >
                                                                                                    Preview
                                                                                                </Badge>
                                                                                            )}
                                                                                        {!material.is_preview &&
                                                                                            !isEnrolled &&
                                                                                            !isInstructor && (
                                                                                                <Lock className="text-muted-foreground/60 h-3.5 w-3.5" />
                                                                                            )}
                                                                                        {material.duration && (
                                                                                            <span className="text-muted-foreground min-w-10 text-right text-xs">
                                                                                                {
                                                                                                    material.duration
                                                                                                }

                                                                                                m
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card border-border sticky top-24 overflow-hidden rounded-xl border shadow-lg">
                            <div className="bg-muted group relative flex aspect-video cursor-pointer items-center justify-center">
                                <img
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Button
                                        size="icon"
                                        className="bg-primary hover:bg-primary/90 h-14 w-14 rounded-full shadow-xl transition-transform hover:scale-110"
                                    >
                                        <Play className="text-primary-foreground ml-1 h-6 w-6" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-3 w-full text-center text-sm font-medium text-white drop-shadow-md">
                                    Preview this course
                                </div>
                            </div>

                            <div className="p-6">
                                {!isEnrolled && !isInstructor && (
                                    <div className="mb-6">
                                        {course.is_free ? (
                                            <div className="text-3xl font-bold">
                                                Free
                                            </div>
                                        ) : (
                                            <div className="flex items-end gap-3">
                                                <span className="text-foreground text-3xl font-bold">
                                                    $
                                                    {isDiscounted
                                                        ? course.discount_price
                                                        : course.price}
                                                </span>
                                                {isDiscounted && (
                                                    <span className="text-muted-foreground mb-1 text-lg line-through">
                                                        ${course.price}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mb-6 space-y-3">
                                    {isCheckingAuth ? (
                                        <Button
                                            disabled
                                            className="h-12 w-full text-base font-semibold"
                                        >
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Checking...
                                        </Button>
                                    ) : !isAuthenticated ? (
                                        <Button
                                            className="h-12 w-full text-base font-semibold"
                                            onClick={() =>
                                                router.push('/login')
                                            }
                                        >
                                            Log in to Enroll
                                        </Button>
                                    ) : isInstructor ? (
                                        <Button
                                            className="h-12 w-full text-base font-semibold"
                                            variant="secondary"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/courses/${course.id}/edit`,
                                                )
                                            }
                                        >
                                            Edit Course
                                        </Button>
                                    ) : isEnrolled ? (
                                        <Button
                                            className="h-12 w-full text-base font-semibold"
                                            onClick={() =>
                                                router.push(
                                                    `/course/${course.id}/learn`,
                                                )
                                            }
                                        >
                                            Continue Learning
                                        </Button>
                                    ) : (
                                        <>
                                            <Button className="h-12 w-full text-base font-semibold">
                                                {course.is_free
                                                    ? 'Enroll for Free'
                                                    : 'Add to Cart'}
                                            </Button>
                                            {!course.is_free && (
                                                <Button
                                                    variant="outline"
                                                    className="h-12 w-full text-base font-semibold"
                                                >
                                                    Buy Now
                                                </Button>
                                            )}
                                            <p className="text-muted-foreground pt-2 text-center text-xs">
                                                30-Day Money-Back Guarantee
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="border-border space-y-4 border-t pt-6">
                                    <h4 className="text-sm font-semibold">
                                        This course includes:
                                    </h4>
                                    {course.total_video_duration_minutes >
                                        0 && (
                                        <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                            <Play className="h-4 w-4 shrink-0" />
                                            <span>
                                                {formatVideoDuration(
                                                    course.total_video_duration_minutes,
                                                )}{' '}
                                                on-demand video
                                            </span>
                                        </div>
                                    )}
                                    {course.total_coding_exercises > 0 && (
                                        <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                            <CodeIcon className="h-4 w-4 shrink-0" />
                                            <span>
                                                {course.total_coding_exercises}{' '}
                                                coding exercises
                                            </span>
                                        </div>
                                    )}
                                    {course.total_file_resources > 0 && (
                                        <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                            <FileText className="h-4 w-4 shrink-0" />
                                            <span>
                                                {course.total_file_resources}{' '}
                                                downloadable resources
                                            </span>
                                        </div>
                                    )}{' '}
                                    <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                        <Globe className="h-4 w-4 shrink-0" />
                                        <span>Full lifetime access</span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                        <Award className="h-4 w-4 shrink-0" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
