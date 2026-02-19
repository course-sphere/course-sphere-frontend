'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    BookOpen,
    DollarSign,
    Target,
    Layers,
    Clock,
    Video,
    FileText,
    HelpCircle,
    Code,
    File,
    CheckCircle,
    AlertTriangle,
    Users,
    Link as LinkIcon,
    Image as ImageIcon,
} from 'lucide-react';
import type { CourseFormData } from '@/lib/schemas/course';
import {
    COURSE_CATEGORIES,
    LANGUAGES,
} from '@/lib/schemas/course';
import { COURSE_LEVELS } from '@/components/course-builder/constant';
import Image from 'next/image';

interface ReviewStepProps {
    data: CourseFormData;
}

export function ReviewStep({ data }: ReviewStepProps) {

    const getCategoryLabel = (value: string) => {
        return COURSE_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    const getLevelLabel = (value: string) => {
        return COURSE_LEVELS.find((l) => l.value === value)?.label || value;
    };

    const getLanguageLabel = (value: string) => {
        return LANGUAGES.find((l) => l.value === value)?.label || value;
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    // Calculate stats
    const getTotalDuration = () => {
        let total = 0;
        data.modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
                lesson.items.forEach((item) => {
                    if (item.video?.duration) total += item.video.duration;
                    if (item.reading?.duration) total += item.reading.duration;
                });
            });
        });
        return total;
    };

    const getContentCounts = () => {
        const counts = { video: 0, reading: 0, quiz: 0, coding: 0, file: 0 };
        data.modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
                lesson.items.forEach((item) => {
                    counts[item.item_type as keyof typeof counts]++;
                });
            });
        });
        return counts;
    };

    const totalLessons = data.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0,
    );
    const totalItems = data.modules.reduce(
        (acc, m) => acc + m.lessons.reduce((a, l) => a + l.items.length, 0),
        0,
    );
    const contentCounts = getContentCounts();
    const totalDuration = getTotalDuration();

    // Validation
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!data.title || data.title.length < 5)
        errors.push('Course title is too short');
    if (!data.description || data.description.length < 50)
        errors.push('Course description is too short');
    if (!data.category) errors.push('Category is not selected');
    if (data.learning_objectives.filter(Boolean).length < 3)
        errors.push('At least 3 learning objectives required');
    if (data.modules.length === 0) errors.push('Course has no modules');
    if (totalItems === 0) errors.push('Course has no content');

    if (!data.thumbnail_url)
        warnings.push(
            'No thumbnail image - courses with thumbnails get 40% more enrollments',
        );
    if (totalDuration < 30)
        warnings.push('Course duration is under 30 minutes');
    if (contentCounts.quiz === 0)
        warnings.push('No quizzes - adding quizzes improves completion rates');

    return (
        <div className="space-y-6">
            {/* Validation Alerts */}
            {errors.length > 0 && (
                <Alert variant="destructive" className="rounded-xl">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <p className="mb-2 font-medium">
                            Please fix the following issues before submitting:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            {errors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {warnings.length > 0 && errors.length === 0 && (
                <Alert className="rounded-xl border-yellow-500/50 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                        <p className="mb-2 font-medium">Recommendations:</p>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            {warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {errors.length === 0 && warnings.length === 0 && (
                <Alert className="rounded-xl border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                        Your course looks great! You can submit it for review.
                    </AlertDescription>
                </Alert>
            )}

            {/* Course Overview */}
            <Card className="border-border overflow-hidden rounded-2xl shadow-sm">
                <div className="flex">
                    {/* Thumbnail */}
                    <div className="bg-muted w-64 flex-shrink-0">
                        {data.thumbnail_url ? (
                            <div className="relative aspect-video">
                                <Image
                                    src={
                                        data.thumbnail_url || '/placeholder.svg'
                                    }
                                    alt={data.title}
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-video items-center justify-center">
                                <ImageIcon className="text-muted-foreground h-12 w-12" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h2 className="text-foreground text-xl font-bold">
                                    {data.title || 'Untitled Course'}
                                </h2>
                                {data.subtitle && (
                                    <p className="text-muted-foreground mt-1">
                                        {data.subtitle}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                {data.is_free ? (
                                    <Badge className="bg-green-600 text-white">
                                        Free
                                    </Badge>
                                ) : (
                                    <div>
                                        {data.discount_price &&
                                            data.discount_price < data.price ? (
                                            <>
                                                <span className="text-primary text-lg font-bold">
                                                    {formatPrice(
                                                        data.discount_price,
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground ml-2 text-sm line-through">
                                                    {formatPrice(data.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-primary text-lg font-bold">
                                                {formatPrice(data.price)}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                            <Badge variant="secondary">
                                {getCategoryLabel(data.category)}
                            </Badge>
                            <Badge variant="outline">
                                {getLevelLabel(data.level)}
                            </Badge>
                            <span>{getLanguageLabel(data.language)}</span>
                        </div>

                        <p className="text-muted-foreground mt-4 line-clamp-2 text-sm">
                            {data.description || 'No description provided'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                            <Layers className="text-primary h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {data.modules.length}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Modules
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalLessons}</p>
                            <p className="text-muted-foreground text-xs">
                                Lessons
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <Video className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalItems}</p>
                            <p className="text-muted-foreground text-xs">
                                Content Items
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <HelpCircle className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {contentCounts.quiz}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Quizzes
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {Math.round(totalDuration / 60)}h
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Duration
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Learning Objectives */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="text-primary h-5 w-5" />
                        Learning Objectives
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {data.learning_objectives
                            .filter(Boolean)
                            .map((objective, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                >
                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>{objective}</span>
                                </li>
                            ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Prerequisites */}
            {(data.prerequisites.length > 0 ||
                data.requirements.filter(Boolean).length > 0) && (
                    <Card className="border-border rounded-2xl shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LinkIcon className="text-primary h-5 w-5" />
                                Prerequisites & Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.prerequisites.length > 0 && (
                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Required Courses:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {data.prerequisites.map((prereq) => (
                                            <Badge
                                                key={prereq.course_id}
                                                variant="secondary"
                                                className="rounded-lg"
                                            >
                                                <BookOpen className="mr-1 h-3 w-3" />
                                                {prereq.course_title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.requirements.filter(Boolean).length > 0 && (
                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Other Requirements:
                                    </p>
                                    <ul className="space-y-1">
                                        {data.requirements
                                            .filter(Boolean)
                                            .map((req, i) => (
                                                <li
                                                    key={i}
                                                    className="text-muted-foreground flex items-center gap-2 text-sm"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    {req}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            {/* Target Audience */}
            {data.target_audience.filter(Boolean).length > 0 && (
                <Card className="border-border rounded-2xl shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="text-primary h-5 w-5" />
                            Target Audience
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {data.target_audience
                                .filter(Boolean)
                                .map((audience, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <Users className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                                        <span>{audience}</span>
                                    </li>
                                ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Curriculum Preview */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Layers className="text-primary h-5 w-5" />
                        Curriculum Preview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.modules.map((module, moduleIndex) => (
                        <div
                            key={module.id}
                            className="border-border overflow-hidden rounded-lg border"
                        >
                            <div className="bg-muted/50 flex items-center gap-3 px-4 py-3">
                                <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded text-sm font-semibold">
                                    {moduleIndex + 1}
                                </div>
                                <span className="font-medium">
                                    {module.title}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="ml-auto text-xs"
                                >
                                    {module.lessons.length} lesson
                                    {module.lessons.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                            <div className="divide-border divide-y">
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                        key={lesson.id}
                                        className="px-4 py-2.5 pl-14"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">
                                                {moduleIndex + 1}.
                                                {lessonIndex + 1}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {lesson.title}
                                            </span>
                                            <div className="ml-auto flex items-center gap-1.5">
                                                {lesson.items.map((item) => {
                                                    const Icon =
                                                        item.item_type ===
                                                            'video'
                                                            ? Video
                                                            : item.item_type ===
                                                                'reading'
                                                                ? FileText
                                                                : item.item_type ===
                                                                    'quiz'
                                                                    ? HelpCircle
                                                                    : item.item_type ===
                                                                        'coding'
                                                                        ? Code
                                                                        : File;
                                                    const color =
                                                        item.item_type ===
                                                            'video'
                                                            ? 'text-blue-500'
                                                            : item.item_type ===
                                                                'reading'
                                                                ? 'text-green-500'
                                                                : item.item_type ===
                                                                    'quiz'
                                                                    ? 'text-purple-500'
                                                                    : item.item_type ===
                                                                        'coding'
                                                                        ? 'text-orange-500'
                                                                        : 'text-gray-500';
                                                    return (
                                                        <Icon
                                                            key={item.id}
                                                            className={`h-3.5 w-3.5 ${color}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
