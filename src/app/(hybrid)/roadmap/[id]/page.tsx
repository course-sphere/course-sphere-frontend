'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    ArrowLeft,
    Rocket,
    Map,
    PlayCircle,
    BookOpen,
    Route,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    useGetRoadmapDetail,
    useGetMultipleCourses,
    useApplyRoadmap,
} from '@/lib/service/roadmap';
import { CourseDetailResponse } from '@/lib/service/course';

function TimelineCourseNode({
    course,
    step,
}: {
    course: CourseDetailResponse;
    step: number;
    isLast: boolean;
}) {
    const imageUrl =
        course.thumbnail_url || 'https://placehold.co/400x300?text=No+Image';
    const instructorName = course.instructor?.name || 'Unknown Instructor';

    return (
        <div className="relative pl-8 md:pl-12">
            <div className="bg-primary text-primary-foreground ring-background absolute top-6 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow-md ring-4 md:-left-[20px] md:h-10 md:w-10 md:text-base">
                {step}
            </div>

            <div className="group bg-card border-border hover:border-primary/40 flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md md:h-40 md:flex-row">
                <div className="bg-muted border-border/50 relative h-32 w-full shrink-0 border-r md:h-full md:w-48">
                    <Image
                        src={imageUrl}
                        alt={course.title || 'Course thumbnail'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 200px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <PlayCircle className="h-10 w-10 text-white opacity-90 shadow-sm" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="text-muted-foreground text-[10px] uppercase"
                        >
                            {course.level || 'Beginner'}
                        </Badge>
                    </div>

                    <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-bold transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                        by{' '}
                        <span className="text-foreground/80 font-medium">
                            {instructorName}
                        </span>
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="text-muted-foreground flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>
                                    {course.learning_objectives?.length || 0}{' '}
                                    modules
                                </span>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="hover:bg-primary/10 hover:text-primary h-8 text-xs font-bold"
                        >
                            <Link href={`/course/${course.id}`}>
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RoadmapDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const resolvedParams = use(params);
    const roadmapId = resolvedParams.id;

    const { data: roadmap, isLoading: isLoadingRoadmap } =
        useGetRoadmapDetail(roadmapId);
    const courseIds = useMemo(() => roadmap?.courses || [], [roadmap?.courses]);
    const { data: coursesData = [], isLoading: isLoadingCourses } =
        useGetMultipleCourses(courseIds);
    const { mutate: applyRoadmap, isPending: isApplying } = useApplyRoadmap();

    const orderedCourses: CourseDetailResponse[] = useMemo(() => {
        return courseIds
            .map((id) => coursesData.find((course) => course.id === id))
            .filter(
                (course): course is CourseDetailResponse =>
                    course !== undefined,
            );
    }, [courseIds, coursesData]);

    if (isLoadingRoadmap) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!roadmap)
        return (
            <div className="p-10 text-center text-lg font-bold">
                Roadmap not found
            </div>
        );

    return (
        <div className="bg-background min-h-screen">
            <header className="sticky top-4 z-50 mx-auto max-w-4xl px-4 md:px-6">
                <div className="bg-card/85 border-border flex items-center justify-between rounded-full border px-4 py-3 shadow-sm backdrop-blur-xl md:px-5">
                    <div className="flex items-center gap-3 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-muted/50 hover:bg-muted h-9 w-9 shrink-0 rounded-full"
                            onClick={() => router.push('/roadmap')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-primary/10 hidden h-8 w-8 items-center justify-center rounded-full md:flex">
                                    <Map className="text-primary h-4 w-4 shrink-0" />
                                </div>
                                <h1 className="text-foreground truncate text-lg font-extrabold tracking-tight md:text-xl">
                                    {roadmap.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            // Gọi hàm apply, thành công phát là đá sang course đầu tiên
                            applyRoadmap(roadmapId, {
                                onSuccess: () => {
                                    if (orderedCourses.length > 0) {
                                        router.push(
                                            `/course/${orderedCourses[0].id}`,
                                        );
                                    }
                                },
                            });
                        }}
                        disabled={isApplying || orderedCourses.length === 0}
                        size="sm"
                        className="gap-2 rounded-full px-5 font-bold shadow-md transition-all hover:scale-105 hover:shadow-lg md:h-10 md:px-6 md:text-sm"
                    >
                        {isApplying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Rocket className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Enroll Pathway</span>
                        <span className="sm:hidden">Enroll</span>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
                <div className="mb-10 text-center md:mb-12">
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight md:text-3xl">
                        Your Learning Journey
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm md:text-base">
                        {roadmap.description ||
                            'Follow these courses step-by-step to master the skills you need.'}
                    </p>
                </div>

                {isLoadingCourses ? (
                    // SKELETON GỌN GÀNG
                    <div className="space-y-8 pl-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-6 md:gap-8">
                                <div className="bg-muted h-8 w-8 shrink-0 animate-pulse rounded-full md:h-10 md:w-10" />
                                <div className="bg-muted/50 h-32 flex-1 animate-pulse rounded-xl md:h-40" />
                            </div>
                        ))}
                    </div>
                ) : orderedCourses.length === 0 ? (
                    <div className="bg-muted/30 border-border flex flex-col items-center justify-center rounded-2xl border p-12 text-center md:p-16">
                        <Route className="text-muted-foreground/30 mb-4 h-12 w-12" />
                        <h3 className="text-lg font-bold">Pathway is empty</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Courses will appear here once added by the creator.
                        </p>
                    </div>
                ) : (
                    <div className="before:bg-border relative pb-10 before:absolute before:top-4 before:left-[15px] before:h-full before:w-[2px] md:before:left-[19px]">
                        <div className="space-y-8 md:space-y-10">
                            {orderedCourses.map((course, index) => (
                                <TimelineCourseNode
                                    key={course.id}
                                    course={course}
                                    step={index + 1}
                                    isLast={index === orderedCourses.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
