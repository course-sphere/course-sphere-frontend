'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
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
    Globe,
    Check,
    Star,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { notFound, useRouter } from 'next/navigation';

import {
    useGetCourseDetail,
    useGetCourseMaterials,
} from '@/lib/service/course';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { getYouTubeEmbedUrl } from '@/lib/utils';

const materialIconMap: Record<string, React.ElementType> = {
    video: Play,
    reading: BookOpen,
    text: BookOpen, // fallback cho data thật
    quiz: HelpCircle,
    coding: CodeIcon,
    assignment: CodeIcon, // fallback cho data thật
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

    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
    const isEnrolled = false; // TODO: Lấy status enroll sau

    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

    // 1. Gọi API lấy thông tin khoá học
    const { data: course, isLoading: isCourseLoading } = useGetCourseDetail(id);

    // 2. GỌI HOOK MỚI: Lấy danh sách Material
    const { data: rawMaterials = [], isLoading: isMaterialsLoading } =
        useGetCourseMaterials(id);

    // 3. XÀO NẤU DATA: Biến mảng phẳng thành cây Syllabus Accordion
    const syllabusModules = useMemo(() => {
        if (!rawMaterials || rawMaterials.length === 0) return [];

        const lessonMap = new Map<string, any[]>();

        rawMaterials.forEach((mat) => {
            const lessonName = mat.lesson || 'General Contents';
            if (!lessonMap.has(lessonName)) {
                lessonMap.set(lessonName, []);
            }
            lessonMap.get(lessonName)!.push({
                ...mat,
                // Đổi type của backend ('text', 'assignment') sang type icon UI hiểu ('reading', 'coding')
                item_type:
                    mat.kind === 'text'
                        ? 'reading'
                        : mat.kind === 'assignment'
                          ? 'coding'
                          : mat.kind,
                is_preview: false, // Mặc định false nếu backend chưa trả
            });
        });

        // Nhào nặn ra mảng module UI
        const modules = Array.from(lessonMap.entries()).map(
            ([lName, mats], index) => ({
                id: `mod-${index}`,
                title: lName,
                lessons: [
                    {
                        id: `les-${index}`,
                        title: '', // Không in ra tựa đề bài học phụ
                        materials: mats.sort((a, b) => a.position - b.position),
                    },
                ],
            }),
        );

        return modules;
    }, [rawMaterials]);

    // Tự động mở Tab đầu tiên khi load xong data
    useEffect(() => {
        if (syllabusModules.length > 0 && expandedModules.length === 0) {
            setExpandedModules([syllabusModules[0].id]);
        }
    }, [syllabusModules]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((mId) => mId !== moduleId)
                : [...prev, moduleId],
        );
    };

    if (isCourseLoading) {
        return (
            <div className="bg-background flex h-screen items-center justify-center">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (!course) {
        notFound();
    }

    const isFree = course.price === 0 || course.is_free;
    const instructorName =
        course.instructor?.name ||
        course.instructor?.displayUsername ||
        'Course Sphere Instructor';
    const instructorImage = course.instructor?.image || '/placeholder.svg';
    const thumbnailUrl =
        course.thumbnail_url ||
        'https://fakeimg.pl/1200x800/1e293b/909090?text=Course+Cover';
    const rating = course.rating || 0;
    const ratingCount = course.rating_count || 0;

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* --- HEADER KHÓA HỌC (Giữ nguyên) --- */}
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-slate-50 shadow-xl md:px-12 md:py-20">
                    <div className="absolute inset-0 z-0 bg-slate-950">
                        <Image
                            src={thumbnailUrl}
                            alt="Course Background"
                            fill
                            priority
                            className="object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="flex flex-wrap items-center gap-3">
                                {course.categories?.map(
                                    (cat: any, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="border-none bg-slate-800/80 text-slate-200 capitalize backdrop-blur-sm hover:bg-slate-700"
                                        >
                                            {typeof cat === 'string'
                                                ? cat
                                                : cat.text}
                                        </Badge>
                                    ),
                                )}
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-balance md:text-5xl lg:leading-tight">
                                {course.title}
                            </h1>
                            <p className="max-w-2xl text-lg text-pretty text-slate-300">
                                {course.subtitle ||
                                    course.description?.substring(0, 150) +
                                        '...'}
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-slate-700">
                                    <Image
                                        src={instructorImage}
                                        alt={instructorName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400">
                                        Created by
                                    </span>
                                    <span className="font-semibold text-white">
                                        {instructorName}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-300">
                                {rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'opacity-30'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-1 font-semibold text-white">
                                            {rating}
                                        </span>
                                        <span>
                                            ({ratingCount.toLocaleString()}{' '}
                                            ratings)
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-slate-400" />
                                    <span>
                                        {(
                                            course.enrolled_students || 0
                                        ).toLocaleString()}{' '}
                                        students
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    <span className="capitalize">
                                        {course.level || 'Beginner'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative flex flex-col items-start gap-12 lg:flex-row">
                    {/* --- CỘT PHẢI: STICKY BOX (MUA/HỌC) --- */}
                    <div className="sticky top-24 z-20 order-1 w-full lg:order-2 lg:w-1/3">
                        <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-xl">
                            <div className="group border-border/50 relative flex aspect-video w-full overflow-hidden border-b bg-black">
                                {isPlayingPreview &&
                                getYouTubeEmbedUrl(
                                    course.promo_video_url || '',
                                ) ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={
                                            getYouTubeEmbedUrl(
                                                course.promo_video_url || '',
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
                                            src={thumbnailUrl}
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
                                        {isFree ? (
                                            <div className="text-foreground text-4xl font-extrabold">
                                                Free
                                            </div>
                                        ) : (
                                            <div className="flex items-end gap-3">
                                                <span className="text-foreground text-4xl font-extrabold">
                                                    ${course.price}
                                                </span>
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
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />{' '}
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
                                            <Button
                                                className="h-14 w-full rounded-xl text-lg font-semibold shadow-md"
                                                onClick={() =>
                                                    router.push(
                                                        `/course/${course.id}/learn`,
                                                    )
                                                }
                                            >
                                                {isFree
                                                    ? 'Enroll for Free'
                                                    : 'Add to Cart'}
                                            </Button>
                                            {!isFree && (
                                                <Button
                                                    variant="outline"
                                                    className="h-14 w-full rounded-xl text-lg font-semibold"
                                                >
                                                    Buy Now
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT TRÁI: NỘI DUNG CHI TIẾT --- */}
                    <div className="order-2 w-full space-y-12 lg:order-1 lg:w-2/3">
                        {course.learning_objectives &&
                            course.learning_objectives.length > 0 && (
                                <div className="border-border bg-card rounded-2xl border p-6 shadow-sm md:p-8">
                                    <h2 className="mb-6 text-2xl font-bold">
                                        What you&apos;ll learn
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {course.learning_objectives.map(
                                            (obj: string, idx: number) => (
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
                                        {course.requirements.map(
                                            (req: string, idx: number) => (
                                                <li key={idx} className="pl-2">
                                                    {req}
                                                </li>
                                            ),
                                        )}
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

                        {/* --- SYLLABUS SECTION ĐÃ ĐƯỢC XÀO NẤU --- */}
                        <div>
                            <div className="mb-6 flex items-end justify-between">
                                <h2 className="text-2xl font-bold">
                                    Course Curriculum
                                </h2>
                                <span className="text-muted-foreground text-sm font-medium">
                                    {syllabusModules.length} sections •{' '}
                                    {rawMaterials.length} items
                                </span>
                            </div>

                            {isMaterialsLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                                </div>
                            ) : rawMaterials.length === 0 ? (
                                <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
                                    No materials available for this course yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {syllabusModules.map((module) => {
                                        const isExpanded =
                                            expandedModules.includes(module.id);
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
                                                            {
                                                                module
                                                                    .lessons[0]
                                                                    .materials
                                                                    .length
                                                            }{' '}
                                                            lessons
                                                        </span>
                                                    </div>
                                                    <ChevronDown
                                                        className={`text-muted-foreground h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {isExpanded && (
                                                    <div className="border-border bg-background border-t px-5 py-4">
                                                        {module.lessons.map(
                                                            (lesson, idx) => (
                                                                <div
                                                                    key={
                                                                        lesson.id
                                                                    }
                                                                    className={
                                                                        idx !==
                                                                        0
                                                                            ? 'mt-6'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <div className="border-border/60 space-y-1 pl-2">
                                                                        {lesson.materials.map(
                                                                            (
                                                                                material: any,
                                                                            ) => {
                                                                                // Ánh xạ Icon chuẩn xác
                                                                                const MaterialIcon =
                                                                                    materialIconMap[
                                                                                        material
                                                                                            .item_type
                                                                                    ] ||
                                                                                    FileText;
                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            material.id
                                                                                        }
                                                                                        className="group hover:bg-primary/5 hover:border-primary/20 flex items-center justify-between rounded-md border border-transparent px-3 py-2.5 transition-colors"
                                                                                    >
                                                                                        <div className="flex items-center gap-3">
                                                                                            <MaterialIcon className="group-hover:text-primary h-4 w-4 text-slate-500 transition-colors" />
                                                                                            <span className="text-foreground/90 group-hover:text-primary text-sm font-medium transition-colors">
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
                                                                                                        className="border-none bg-blue-50 text-[10px] tracking-wider text-blue-600 uppercase"
                                                                                                    >
                                                                                                        Preview
                                                                                                    </Badge>
                                                                                                )}
                                                                                            {!material.is_preview &&
                                                                                                !isEnrolled &&
                                                                                                !isInstructor && (
                                                                                                    <Lock className="h-3.5 w-3.5 text-slate-400" />
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
