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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import { useGetCourseDetail, useUpdateCourse } from '@/lib/service/course';
import { InlineTextEdit } from '@/components/course-builder/inline-edit/inline-text-edit';
import { InlineRichTextEdit } from '@/components/course-builder/inline-edit/inline-richtext-edit';
import { InlineArrayEdit } from '@/components/course-builder/inline-edit/inline-array-edit';
import { InlineMediaEdit } from '@/components/course-builder/inline-edit/inline-media-edit';
import { EmptyState } from '@/components/ui/empty-state';

export default function CourseOverviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const { data: course, isLoading } = useGetCourseDetail(id);
    const { mutateAsync: updateCourse } = useUpdateCourse(id);

    const handleUpdateField = async (field: string, newValue: any) => {
        await updateCourse({ [field]: newValue });
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
                <div className="group relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-slate-50 shadow-2xl md:px-12 md:py-20">
                    <div className="absolute inset-0 z-0">
                        <InlineMediaEdit
                            url={course.thumbnail_url || ''}
                            type="image"
                            className="h-full w-full rounded-none border-0 opacity-40 hover:opacity-60"
                            onUploadAndSave={async (file) => {
                                const tempUrl = URL.createObjectURL(file);
                                await handleUpdateField(
                                    'thumbnail_url',
                                    tempUrl,
                                );
                                return tempUrl;
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/80 to-transparent" />
                    </div>

                    <div className="relative z-10 w-full space-y-6 lg:w-2/3">
                        <div className="flex flex-wrap items-center gap-2">
                            {course.category?.map((cat: any) => (
                                <Badge
                                    key={cat.id || cat}
                                    variant="secondary"
                                    className="bg-slate-800/80 text-slate-200"
                                >
                                    {cat.text || cat}
                                </Badge>
                            ))}
                        </div>

                        <InlineTextEdit
                            value={course.title}
                            onSave={(val) => handleUpdateField('title', val)}
                            textClassName="text-4xl font-extrabold tracking-tight md:text-5xl lg:leading-tight text-white"
                        />

                        <InlineTextEdit
                            value={course.subtitle || ''}
                            onSave={(val) => handleUpdateField('subtitle', val)}
                            textClassName="max-w-2xl text-lg text-slate-300"
                            type="textarea"
                            placeholder="Add a catchy subtitle..."
                        />

                        <div className="flex items-center gap-6 pt-2 text-sm text-slate-300">
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-bold text-white">
                                    {course.rating || '0.0'}
                                </span>
                                <span className="text-slate-400">
                                    ({course.rating_count || 0} ratings)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />{' '}
                                {course.enrolled_students || 0} students
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" /> {course.level}
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
                                What you'll learn
                            </h2>
                            <InlineArrayEdit
                                items={course.learning_objectives}
                                onSave={(items) =>
                                    handleUpdateField(
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

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">
                                    Requirements
                                </h2>
                                <InlineArrayEdit
                                    items={course.requirements}
                                    emptyMessage="No requirements added."
                                    onSave={(items) =>
                                        handleUpdateField('requirements', items)
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
                                    items={course.target_audience}
                                    emptyMessage="Add target audience."
                                    onSave={(items) =>
                                        handleUpdateField(
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
                            <div className="border-border relative aspect-video w-full border-b bg-slate-100 dark:bg-slate-900">
                                <InlineMediaEdit
                                    url={course.promo_video_url || ''}
                                    type="video"
                                    className="h-full w-full rounded-none border-0"
                                    onUploadAndSave={async (file) => {
                                        const tempUrl =
                                            URL.createObjectURL(file);
                                        await handleUpdateField(
                                            'promo_video_url',
                                            tempUrl,
                                        );
                                        return tempUrl;
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
