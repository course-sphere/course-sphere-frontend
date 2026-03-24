'use client';

import { use } from 'react';
import {
    Users,
    Globe,
    Star,
    Check,
    CircleDot,
    PlayCircle,
    Code,
    FileText,
    Award,
    Crosshair,
    Loader2,
    BookOpen,
    Video,
    Files,
    FileQuestion,
    UploadCloud,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { COURSE_LEVELS } from '@/components/course-builder/constant';
import {
    UpdateCoursePayload,
    useGetCourseDetail,
    useUpdateCourse,
    useGetAllCourses,
} from '@/lib/service/course';
import { InlineTextEdit } from '@/components/course-builder/inline-edit/inline-text-edit';
import { InlineRichTextEdit } from '@/components/course-builder/inline-edit/inline-richtext-edit';
import { InlineArrayEdit } from '@/components/course-builder/inline-edit/inline-array-edit';
import { InlineMediaEdit } from '@/components/course-builder/inline-edit/inline-media-edit';
import { EmptyState } from '@/components/ui/empty-state';
import { InlineSelectEdit } from '@/components/course-builder/inline-edit/inline-select-edit';
import { CoursePrerequisiteSelect } from '@/components/course-prerequisite-select';
import { useUploadPublicFile } from '@/lib/service/storage';

export default function CourseOverviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const { data: course, isLoading } = useGetCourseDetail(id);
    const { mutateAsync: updateCourse } = useUpdateCourse(id);

    const { data: allCourses } = useGetAllCourses();
    const { mutateAsync: uploadPublicFile } = useUploadPublicFile();

    const handleUpdateField = async (
        field: keyof UpdateCoursePayload,
        newValue: unknown,
    ) => {
        try {
            const cleanValue = Array.isArray(newValue)
                ? newValue.filter((val) =>
                      typeof val === 'string'
                          ? val.trim() !== ''
                          : Boolean(val),
                  )
                : newValue;

            await updateCourse({ [field]: cleanValue });
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
        }
    };

    const handleAddPrerequisite = async (courseId: string) => {
        if (!courseId) return;

        const current = course?.prerequisites || [];
        const currentIds = current.map((p: { course_id: string } | string) =>
            typeof p === 'object' ? p.course_id : p,
        );

        if (!currentIds.includes(courseId)) {
            const newIds = [...currentIds, courseId];
            await handleUpdateField('prerequisites', newIds as string[]);
        }
    };

    const handleRemovePrerequisite = async (courseId: string) => {
        if (!course?.prerequisites) return;
        const currentIds = course.prerequisites.map(
            (p: { course_id: string } | string) =>
                typeof p === 'object' ? p.course_id : p,
        );
        const newIds = currentIds.filter((id: string) => id !== courseId);
        await handleUpdateField('prerequisites', newIds as string[]);
    };

    if (isLoading) {
        return (
            <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    Loading Canvas Workspace...
                </p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <EmptyState
                        title="Course Not Found"
                        description="The course you are looking for does not exist, has been deleted, or you don't have permission to view it."
                        icons={[FileQuestion]}
                        action={{
                            label: 'Back to Courses',
                            onClick: () => router.push('/course'),
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="group relative flex min-h-90 items-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-slate-900 shadow-sm md:px-12 md:py-20">
                    <div
                        className={`absolute inset-0 z-0 transition-all duration-300 ${!course.thumbnail_url ? 'm-4 rounded-2xl border-4 border-dashed border-slate-300 bg-slate-100/50 hover:bg-slate-200/50 sm:m-6' : ''}`}
                    >
                        <InlineMediaEdit
                            url={course.thumbnail_url || ''}
                            type="image"
                            className={`absolute inset-0 z-20 h-full w-full cursor-pointer rounded-none border-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover ${course.thumbnail_url ? 'opacity-0 transition-all duration-300 hover:bg-black/20 hover:opacity-100' : 'opacity-0'}`}
                            onUploadAndSave={async (file) => {
                                const res = await uploadPublicFile(file);
                                const finalUrl = res.url;

                                await handleUpdateField(
                                    'thumbnail_url',
                                    finalUrl,
                                );
                                return finalUrl;
                            }}
                        />

                        {course.thumbnail_url ? (
                            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-slate-50/95 via-slate-50/80 to-transparent backdrop-blur-[2px]" />
                        ) : (
                            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-end justify-center pr-12 lg:pr-24">
                                <div className="flex animate-pulse flex-col items-center text-center">
                                    <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                        <UploadCloud className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-slate-700">
                                        Upload Cover Image
                                    </span>
                                    <span className="mt-2 text-sm font-medium text-slate-500">
                                        1920x1080 recommended
                                    </span>
                                </div>
                            </div>
                        )}
                        {!course.thumbnail_url && (
                            <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-slate-50/90 via-slate-50/70 to-transparent" />
                        )}
                    </div>

                    <div className="relative z-30 w-full space-y-6 lg:w-2/3">
                        <div className="flex w-full items-center">
                            <div className="w-full pr-8">
                                <InlineArrayEdit
                                    listClassName="flex flex-wrap gap-2 space-y-0"
                                    items={
                                        (course.categories || [])
                                            .map(
                                                (
                                                    cat:
                                                        | { text?: string }
                                                        | string,
                                                ) =>
                                                    typeof cat === 'object'
                                                        ? cat.text
                                                        : cat,
                                            )
                                            .filter(Boolean) as string[]
                                    }
                                    emptyMessage="Add topics"
                                    onSave={async (items) =>
                                        await handleUpdateField(
                                            'categories',
                                            items,
                                        )
                                    }
                                    renderItem={(item) => (
                                        <Badge
                                            variant="secondary"
                                            className="border border-slate-300/50 bg-slate-200 text-slate-700 shadow-sm hover:bg-slate-300"
                                        >
                                            {item}
                                        </Badge>
                                    )}
                                />
                            </div>
                        </div>
                        <InlineTextEdit
                            value={course.title}
                            onSave={async (val) =>
                                await handleUpdateField('title', val)
                            }
                            textClassName="text-4xl font-extrabold tracking-tight md:text-5xl lg:leading-tight text-slate-900"
                        />
                        <InlineTextEdit
                            value={course.subtitle || ''}
                            onSave={async (val) =>
                                await handleUpdateField('subtitle', val)
                            }
                            textClassName="max-w-2xl text-lg text-slate-600 font-medium drop-shadow-sm"
                            type="textarea"
                            placeholder="Add a catchy subtitle..."
                        />
                        <div className="flex items-center gap-6 pt-2 text-sm font-medium text-slate-700">
                            <div className="flex items-center gap-1 text-amber-500 drop-shadow-sm">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-bold text-slate-900">
                                    {course.rating || '0.0'}
                                </span>
                                <span className="text-slate-600">
                                    ({course.rating_count || 0} ratings)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />{' '}
                                {course.enrolled_students || 0} students
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                <InlineSelectEdit
                                    value={course.level}
                                    options={COURSE_LEVELS}
                                    onSave={async (val) =>
                                        await handleUpdateField('level', val)
                                    }
                                    textClassName="capitalize text-slate-700 group-hover:text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative flex flex-col items-start gap-10 lg:flex-row">
                    <div className="order-2 w-full space-y-12 lg:order-1 lg:w-2/3">
                        <div className="border-border bg-card rounded-2xl border p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold">
                                What you will learn
                            </h2>
                            <InlineArrayEdit
                                items={course.learning_objectives}
                                onSave={async (items) =>
                                    await handleUpdateField(
                                        'learning_objectives',
                                        items,
                                    )
                                }
                                renderItem={(item) => (
                                    <div className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                                        <span className="text-foreground/90 text-sm leading-relaxed font-medium">
                                            {item}
                                        </span>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">
                                    Requirements
                                </h2>
                                <InlineArrayEdit
                                    items={course.requirements}
                                    emptyMessage="No requirements added."
                                    onSave={async (items) =>
                                        await handleUpdateField(
                                            'requirements',
                                            items,
                                        )
                                    }
                                    renderItem={(item) => (
                                        <div className="flex items-center gap-3 py-1.5">
                                            <CircleDot className="fill-foreground text-foreground h-2 w-2 shrink-0" />
                                            <span className="text-foreground/80 text-sm">
                                                {item}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">
                                    Who this course is for
                                </h2>
                                <InlineArrayEdit
                                    items={
                                        course.target_audience ||
                                        course.target_audience
                                    }
                                    emptyMessage="Add target audience."
                                    onSave={async (items) =>
                                        await handleUpdateField(
                                            'target_audiences',
                                            items,
                                        )
                                    }
                                    renderItem={(item) => (
                                        <div className="flex items-center gap-3 py-1.5">
                                            <Crosshair className="text-primary h-4 w-4 shrink-0" />
                                            <span className="text-foreground/80 text-sm">
                                                {item}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <h2 className="mt-4 mb-4 text-2xl font-bold">
                                    Prerequisites
                                </h2>
                                <div className="space-y-4">
                                    {course.prerequisites &&
                                    course.prerequisites.length > 0 ? (
                                        <div className="space-y-2">
                                            {course.prerequisites.map(
                                                (
                                                    req:
                                                        | {
                                                              course_id: string;
                                                              course_title?: string;
                                                          }
                                                        | string,
                                                ) => {
                                                    const reqId =
                                                        typeof req === 'object'
                                                            ? req.course_id
                                                            : req;
                                                    const foundCourse =
                                                        allCourses?.find(
                                                            (c) =>
                                                                c.id === reqId,
                                                        );
                                                    const displayTitle =
                                                        foundCourse?.title ||
                                                        (typeof req ===
                                                            'object' &&
                                                        'course_title' in req
                                                            ? req.course_title
                                                            : reqId);

                                                    return (
                                                        <div
                                                            key={reqId}
                                                            className="border-border bg-muted/30 flex items-center gap-3 rounded-xl border p-3"
                                                        >
                                                            <BookOpen className="h-4 w-4 shrink-0 text-amber-500" />
                                                            <span className="text-foreground/80 flex-1 text-sm font-medium">
                                                                {displayTitle}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                                                onClick={() =>
                                                                    handleRemovePrerequisite(
                                                                        reqId,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground mb-2 text-sm italic">
                                            No prerequisite courses.
                                        </p>
                                    )}
                                    <div className="max-w-md">
                                        <CoursePrerequisiteSelect
                                            value=""
                                            onChange={(val) =>
                                                handleAddPrerequisite(val)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h2 className="mb-4 text-2xl font-bold">
                                Description
                            </h2>
                            <InlineRichTextEdit
                                value={course.description}
                                onSave={(val) =>
                                    handleUpdateField('description', val)
                                }
                                placeholder="Write a comprehensive description..."
                            />
                        </div>

                        <div className="border-border border-t pt-10">
                            <h2 className="mb-6 text-2xl font-bold">
                                Course Curriculum
                            </h2>
                            <EmptyState
                                title="No lessons added yet"
                                description="Start building your course curriculum by adding modules, video lessons, and resources."
                                icons={[BookOpen, Video, Files]}
                                action={{
                                    label: 'Manage Curriculum',
                                    onClick: () =>
                                        router.push(
                                            `/course/${course.id}/curriculum`,
                                        ),
                                }}
                            />
                        </div>
                    </div>

                    <div className="sticky top-24 z-20 order-1 w-full lg:order-2 lg:w-1/3">
                        <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-xl">
                            <div className="border-border relative aspect-video w-full overflow-hidden border-b bg-slate-100 dark:bg-slate-900">
                                <InlineMediaEdit
                                    url={course.promo_video_url || ''}
                                    type="video"
                                    className="h-full w-full rounded-none border-0 [&_video]:pointer-events-none [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
                                    onUploadAndSave={async (file) => {
                                        const res =
                                            await uploadPublicFile(file);
                                        const finalUrl = res.url;

                                        await handleUpdateField(
                                            'promo_video_url',
                                            finalUrl,
                                        );
                                        return finalUrl;
                                    }}
                                />
                            </div>

                            <div className="space-y-6 p-6">
                                <div className="flex items-center gap-1">
                                    <span className="text-4xl font-extrabold">
                                        $
                                    </span>
                                    <InlineTextEdit
                                        value={course.price?.toString() || '0'}
                                        onSave={(val) =>
                                            handleUpdateField(
                                                'price',
                                                Number(val),
                                            )
                                        }
                                        textClassName="text-4xl font-extrabold hover:text-primary transition-colors"
                                    />
                                </div>

                                <Button
                                    size="lg"
                                    className="text-md h-14 w-full rounded-xl font-bold shadow-md"
                                    onClick={() =>
                                        router.push(
                                            `/course/${course.id}/curriculum`,
                                        )
                                    }
                                >
                                    Manage Lessons & Content
                                </Button>

                                <div className="border-border space-y-4 border-t pt-4">
                                    <h4 className="text-sm font-bold">
                                        This course includes:
                                    </h4>
                                    <div className="text-muted-foreground space-y-3 text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle className="h-4 w-4" />{' '}
                                            On-demand video
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Code className="h-4 w-4" /> Coding
                                            exercises
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4" />{' '}
                                            Downloadable resources
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4" /> Full
                                            lifetime access
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Award className="h-4 w-4" />{' '}
                                            Certificate of completion
                                        </div>
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
