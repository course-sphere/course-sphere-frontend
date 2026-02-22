'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
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
import { getYouTubeEmbedUrl } from '@/lib/utils';

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
    const isEnrolled = false;

    const [expandedModules, setExpandedModules] = useState<string[]>(
        syllabus?.modules?.[0] ? [syllabus.modules[0].id] : [],
    );

    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

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
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-slate-50 shadow-xl md:px-12 md:py-20">
                    <div className="absolute inset-0 z-0 bg-slate-950">
                        <Image
                            src={course.thumbnail_url}
                            alt="Course Background"
                            fill
                            priority
                            className="object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                    </div>{' '}
                    <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="flex flex-wrap items-center gap-3">
                                {course.category?.map((cat) => (
                                    <Badge
                                        key={cat.id}
                                        variant="secondary"
                                        className="border-none bg-slate-800/80 text-slate-200 backdrop-blur-sm hover:bg-slate-700"
                                    >
                                        {cat.text}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-balance md:text-5xl lg:leading-tight">
                                {course.title}
                            </h1>
                            <p className="max-w-2xl text-lg text-pretty text-slate-300">
                                {course.subtitle}
                            </p>

                            {course.instructor && (
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-slate-700">
                                        <Image
                                            src={
                                                course.instructor.avatar_url ||
                                                '/placeholder.svg'
                                            }
                                            alt={course.instructor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">
                                            Created by
                                        </span>
                                        <span className="font-semibold text-white">
                                            {course.instructor.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-300">
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
                                    <Users className="h-4 w-4 text-slate-400" />
                                    <span>
                                        {course.enrolled_students?.toLocaleString()}
                                        + students
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-slate-400" />
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
                {/* Dùng flex thay vì grid để dễ dàng dùng thuộc tính order đảo vị trí trên mobile */}
                <div className="relative flex flex-col items-start gap-12 lg:flex-row">
                    {/* RIGHT COLUMN: STICKY CHECKOUT CARD (Đưa lên đầu trong code HTML) */}
                    {/* Bằng class order-1 trên mobile, order-2 trên desktop, thẻ này sẽ hiển thị dưới Hero ở mobile và sang phải ở Desktop */}
                    <div className="sticky top-24 z-20 order-1 w-full lg:order-2 lg:w-1/3">
                        <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-xl">
                            <div className="group border-border/50 relative flex aspect-video w-full overflow-hidden border-b bg-black">
                                {isPlayingPreview &&
                                getYouTubeEmbedUrl(course.promo_video_url) ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={
                                            getYouTubeEmbedUrl(
                                                course.promo_video_url,
                                            ) || ''
                                        }
                                        title="Course Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 border-0"
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 h-full w-full cursor-pointer"
                                        onClick={() => {
                                            if (course.promo_video_url)
                                                setIsPlayingPreview(true);
                                        }}
                                    >
                                        <Image
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {course.promo_video_url && (
                                            <>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl transition-transform group-hover:scale-110">
                                                        <Play className="ml-1 h-7 w-7 fill-current" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-4 w-full text-center text-sm font-bold tracking-wide text-white drop-shadow-lg">
                                                    Preview this course
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 md:p-8">
                                {!isEnrolled && !isInstructor && (
                                    <div className="mb-6">
                                        {course.is_free ? (
                                            <div className="text-foreground text-4xl font-extrabold">
                                                Free
                                            </div>
                                        ) : (
                                            <div className="flex items-end gap-3">
                                                <span className="text-foreground text-4xl font-extrabold">
                                                    $
                                                    {isDiscounted
                                                        ? course.discount_price
                                                        : course.price}
                                                </span>
                                                {isDiscounted && (
                                                    <span className="text-muted-foreground mb-1 text-xl font-medium line-through">
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
                                            className="h-14 w-full rounded-xl text-lg font-semibold"
                                        >
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Checking...
                                        </Button>
                                    ) : !isAuthenticated ? (
                                        <Button
                                            className="h-14 w-full rounded-xl text-lg font-semibold"
                                            onClick={() =>
                                                router.push('/login')
                                            }
                                        >
                                            Log in to Enroll
                                        </Button>
                                    ) : isInstructor ? (
                                        <Button
                                            className="h-14 w-full rounded-xl text-lg font-semibold"
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
                                            className="h-14 w-full rounded-xl text-lg font-semibold"
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
                                            <Button className="h-14 w-full rounded-xl text-lg font-semibold shadow-md">
                                                {course.is_free
                                                    ? 'Enroll for Free'
                                                    : 'Add to Cart'}
                                            </Button>
                                            {!course.is_free && (
                                                <Button
                                                    variant="outline"
                                                    className="h-14 w-full rounded-xl text-lg font-semibold"
                                                >
                                                    Buy Now
                                                </Button>
                                            )}
                                            <p className="text-muted-foreground pt-2 text-center text-xs font-medium">
                                                30-Day Money-Back Guarantee
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="border-border space-y-4 border-t pt-6">
                                    <h4 className="text-foreground text-base font-bold">
                                        This course includes:
                                    </h4>

                                    {course?.total_video_duration_minutes >
                                        0 && (
                                        <div className="text-foreground/80 flex items-center gap-3 text-sm">
                                            <Play className="h-4 w-4 shrink-0 text-slate-500" />
                                            <span>
                                                {Math.floor(
                                                    course.total_video_duration_minutes /
                                                        60,
                                                )}{' '}
                                                hours on-demand video
                                            </span>
                                        </div>
                                    )}

                                    {course?.total_coding_exercises > 0 && (
                                        <div className="text-foreground/80 flex items-center gap-3 text-sm">
                                            <CodeIcon className="h-4 w-4 shrink-0 text-slate-500" />
                                            <span>
                                                {course.total_coding_exercises}{' '}
                                                coding exercises
                                            </span>
                                        </div>
                                    )}

                                    {course?.total_file_resources > 0 && (
                                        <div className="text-foreground/80 flex items-center gap-3 text-sm">
                                            <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                                            <span>
                                                {course.total_file_resources}{' '}
                                                downloadable resources
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-foreground/80 flex items-center gap-3 text-sm">
                                        <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                                        <span>Full lifetime access</span>
                                    </div>

                                    <div className="text-foreground/80 flex items-center gap-3 text-sm">
                                        <Award className="h-4 w-4 shrink-0 text-slate-500" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LEFT COLUMN */}
                    <div className="order-2 w-full space-y-12 lg:order-1 lg:w-2/3">
                        {course.learning_objectives &&
                            course.learning_objectives.length > 0 && (
                                <div className="border-border bg-card rounded-2xl border p-6 shadow-sm md:p-8">
                                    {/* Fix lỗi Lint dấu nháy đơn */}
                                    <h2 className="mb-6 text-2xl font-bold">
                                        What you&apos;ll learn
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {course.learning_objectives.map(
                                            (obj, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex gap-3"
                                                >
                                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                                                    <span className="text-foreground/80 text-sm">
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
                                    <ul className="text-foreground/80 list-disc space-y-2 pl-5">
                                        {course.requirements.map((req, idx) => (
                                            <li key={idx} className="pl-2">
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        <div>
                            <h2 className="mb-4 text-2xl font-bold">
                                Description
                            </h2>
                            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {course.description}
                            </p>
                        </div>

                        <div>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-2xl font-bold">
                                    Course Curriculum
                                </h2>
                                <span className="text-muted-foreground text-sm font-medium">
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
                                            className="border-border overflow-hidden shadow-sm transition-all duration-200"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleModule(module.id)
                                                }
                                                className="flex w-full items-center justify-between p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                                            >
                                                <div className="flex flex-col text-left">
                                                    <h3 className="text-foreground text-base font-semibold">
                                                        {module.title}
                                                    </h3>
                                                    <span className="text-muted-foreground mt-1 text-sm">
                                                        {module.lessons.length}{' '}
                                                        lessons
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    className={`text-muted-foreground h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {isExpanded && (
                                                <div className="border-border bg-background border-t px-5 py-4">
                                                    {module.lessons?.map(
                                                        (lesson, idx) => (
                                                            <div
                                                                key={lesson.id}
                                                                className={
                                                                    idx !== 0
                                                                        ? 'mt-6'
                                                                        : ''
                                                                }
                                                            >
                                                                <h4 className="text-foreground mb-3 text-sm font-semibold">
                                                                    {
                                                                        lesson.title
                                                                    }
                                                                </h4>
                                                                <div className="border-border/60 ml-2 space-y-1 border-l-2 pl-4">
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
                                                                                    // Sửa lỗi màu hover Syllabus material ở đây (bg-primary/5)
                                                                                    className="group hover:bg-primary/5 hover:border-primary/20 flex items-center justify-between rounded-md border border-transparent px-3 py-2.5 transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        <MaterialIcon className="group-hover:text-primary h-4 w-4 text-slate-500 transition-colors" />
                                                                                        <span
                                                                                            className={`text-sm font-medium transition-colors ${isEnrolled && material.is_completed ? 'text-muted-foreground line-through' : 'text-foreground/90 group-hover:text-primary'}`}
                                                                                        >
                                                                                            {
                                                                                                material.title
                                                                                            }
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="flex items-center gap-4">
                                                                                        {material.is_preview &&
                                                                                            !isEnrolled && (
                                                                                                <Badge
                                                                                                    variant="secondary"
                                                                                                    className="border-none bg-blue-50 text-[10px] tracking-wider text-blue-600 uppercase hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                                                                >
                                                                                                    Preview
                                                                                                </Badge>
                                                                                            )}
                                                                                        {!material.is_preview &&
                                                                                            !isEnrolled &&
                                                                                            !isInstructor && (
                                                                                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                                                                                            )}
                                                                                        {material.duration && (
                                                                                            <span className="text-muted-foreground min-w-8 text-right text-xs">
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
                </div>
            </div>
        </div>
    );
}
