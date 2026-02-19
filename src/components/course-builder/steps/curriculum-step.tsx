'use client';

import { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Trash2,
    GripVertical,
    Video,
    FileText,
    HelpCircle,
    Code,
    File,
    MoreVertical,
    ChevronDown,
    Eye,
    Clock,
    AlertCircle,
    Layers,
    BookOpen,
} from 'lucide-react';
import type {
    CourseModuleFormData,
    LessonItem,
    Module,
    Lesson,
} from '@/lib/schemas/course';
import {
    createEmptyModule,
    createEmptyLesson,
    createEmptyLessonItem,
    generateId,
} from '@/lib/schemas/course';
import { LessonItemEditor } from '../editors/lesson-item-editor';

interface CurriculumStepProps {
    form: UseFormReturn<CourseModuleFormData>;
    onSaveModule?: (moduleIndex: number) => void;
}

const ITEM_TYPES = [
    {
        type: 'video',
        label: 'Video Lecture',
        icon: Video,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        type: 'reading',
        label: 'Reading Material',
        icon: FileText,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        type: 'quiz',
        label: 'Quiz',
        icon: HelpCircle,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        type: 'coding',
        label: 'Coding Assignment',
        icon: Code,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    {
        type: 'file',
        label: 'Downloadable File',
        icon: File,
        color: 'text-gray-500',
        bg: 'bg-gray-500/10',
    },
] as const;

export function CurriculumStep({ form }: CurriculumStepProps) {
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [editingItem, setEditingItem] = useState<{
        moduleIndex: number;
        lessonIndex: number;
        itemIndex: number;
    } | null>(null);

    const modules = form.watch('modules') || [];

    const addModule = () => {
        const currentModules = form.getValues('modules') || [];
        form.setValue('modules', [
            ...currentModules,
            createEmptyModule(currentModules.length + 1),
        ]);
    };

    const removeModule = (moduleIndex: number) => {
        const currentModules = form.getValues('modules');
        form.setValue(
            'modules',
            currentModules.filter((_, i) => i !== moduleIndex),
        );
    };

    const addLesson = (moduleIndex: number) => {
        const currentModules = form.getValues('modules');
        const module = currentModules[moduleIndex];
        form.setValue(`modules.${moduleIndex}.lessons`, [
            ...module.lessons,
            createEmptyLesson(module.lessons.length + 1),
        ]);
    };

    const removeLesson = (moduleIndex: number, lessonIndex: number) => {
        const currentModules = form.getValues('modules');
        const module = currentModules[moduleIndex];
        form.setValue(
            `modules.${moduleIndex}.lessons`,
            module.lessons.filter((_, i) => i !== lessonIndex),
        );
    };

    const addLessonItem = (
        moduleIndex: number,
        lessonIndex: number,
        type: LessonItem['item_type'],
    ) => {
        const currentModules = form.getValues('modules');
        const lesson = currentModules[moduleIndex].lessons[lessonIndex];
        const newItem = createEmptyLessonItem(type, lesson.items.length + 1);
        form.setValue(`modules.${moduleIndex}.lessons.${lessonIndex}.items`, [
            ...lesson.items,
            newItem,
        ]);
        // Auto open editor
        setEditingItem({
            moduleIndex,
            lessonIndex,
            itemIndex: lesson.items.length,
        });
    };

    const removeLessonItem = (
        moduleIndex: number,
        lessonIndex: number,
        itemIndex: number,
    ) => {
        const currentModules = form.getValues('modules');
        const lesson = currentModules[moduleIndex].lessons[lessonIndex];
        form.setValue(
            `modules.${moduleIndex}.lessons.${lessonIndex}.items`,
            lesson.items.filter((_, i) => i !== itemIndex),
        );
        if (
            editingItem?.moduleIndex === moduleIndex &&
            editingItem?.lessonIndex === lessonIndex &&
            editingItem?.itemIndex === itemIndex
        ) {
            setEditingItem(null);
        }
    };

    const getItemConfig = (type: string) => {
        return ITEM_TYPES.find((t) => t.type === type) || ITEM_TYPES[0];
    };

    const getTotalDuration = () => {
        let total = 0;
        modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
                lesson.items.forEach((item) => {
                    if (item.video?.duration) total += item.video.duration;
                    if (item.reading?.duration) total += item.reading.duration;
                });
            });
        });
        return total;
    };

    const getTotalItems = () => {
        let total = 0;
        modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
                total += lesson.items.length;
            });
        });
        return total;
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                            <Layers className="text-primary h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {modules.length}
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
                            <p className="text-2xl font-bold">
                                {modules.reduce(
                                    (acc, m) => acc + m.lessons.length,
                                    0,
                                )}
                            </p>
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
                            <p className="text-2xl font-bold">
                                {getTotalItems()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Content Items
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
                                {Math.round(getTotalDuration() / 60)}h
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Total Duration
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Modules List */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                Course Curriculum
                            </CardTitle>
                            <CardDescription>
                                Organize your content into modules and lessons
                            </CardDescription>
                        </div>
                        <Button onClick={addModule} className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Module
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {modules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                                <Layers className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="text-foreground mb-1 font-medium">
                                No modules yet
                            </h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Start building your course by adding your first
                                module
                            </p>
                            <Button onClick={addModule} className="rounded-xl">
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Module
                            </Button>
                        </div>
                    ) : (
                        <Accordion
                            type="multiple"
                            value={expandedModules}
                            onValueChange={setExpandedModules}
                            className="space-y-3"
                        >
                            {modules.map((module, moduleIndex) => (
                                <AccordionItem
                                    key={module.id}
                                    value={module.id}
                                    className="border-border overflow-hidden rounded-xl border px-0"
                                >
                                    {/* Module Header */}
                                    <div className="flex items-center gap-3 px-4 py-3 [&:has([data-state=open])]:bg-muted/50">
                                        <div className="text-muted-foreground hover:text-foreground cursor-grab">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold">
                                            {moduleIndex + 1}
                                        </div>
                                        <AccordionTrigger className="flex-1 gap-3 py-0 hover:no-underline">
                                            <div className="flex-1 text-left">
                                                <FormField
                                                    control={form.control}
                                                    name={`modules.${moduleIndex}.title`}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Module title"
                                                            className="h-8 border-0 bg-transparent p-0 text-base font-medium focus-visible:ring-0"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="rounded-lg"
                                            >
                                                {module.lessons.length} lesson
                                                {module.lessons.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </Badge>
                                        </AccordionTrigger>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="rounded-xl"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        addLesson(
                                                            moduleIndex,
                                                        )
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Lesson
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        removeModule(
                                                            moduleIndex,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Module
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Module Content - Lessons */}
                                    <AccordionContent className="pb-0">
                                        <div className="border-border border-t">
                                            {module.lessons.map(
                                                (lesson, lessonIndex) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="border-border border-b last:border-b-0"
                                                    >
                                                        {/* Lesson Header */}
                                                        <div className="bg-muted/30 flex items-center gap-3 px-4 py-3">
                                                            <div className="pl-8">
                                                                <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium">
                                                                    {moduleIndex +
                                                                        1}
                                                                    .
                                                                    {lessonIndex +
                                                                        1}
                                                                </div>
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Lesson title"
                                                                        className="h-8 flex-1 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
                                                                    />
                                                                )}
                                                            />
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-lg text-xs"
                                                            >
                                                                {
                                                                    lesson.items
                                                                        .length
                                                                }{' '}
                                                                item
                                                                {lesson.items
                                                                    .length !==
                                                                    1
                                                                    ? 's'
                                                                    : ''}
                                                            </Badge>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7"
                                                                    >
                                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="rounded-xl"
                                                                >
                                                                    {ITEM_TYPES.map(
                                                                        (
                                                                            itemType,
                                                                        ) => (
                                                                            <DropdownMenuItem
                                                                                key={
                                                                                    itemType.type
                                                                                }
                                                                                onClick={() =>
                                                                                    addLessonItem(
                                                                                        moduleIndex,
                                                                                        lessonIndex,
                                                                                        itemType.type,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <itemType.icon
                                                                                    className={`mr-2 h-4 w-4 ${itemType.color}`}
                                                                                />
                                                                                Add{' '}
                                                                                {
                                                                                    itemType.label
                                                                                }
                                                                            </DropdownMenuItem>
                                                                        ),
                                                                    )}
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-destructive"
                                                                        onClick={() =>
                                                                            removeLesson(
                                                                                moduleIndex,
                                                                                lessonIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                        Lesson
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        {/* Lesson Items */}
                                                        <div className="pr-4 pl-16">
                                                            {lesson.items
                                                                .length ===
                                                                0 ? (
                                                                <div className="py-6 text-center">
                                                                    <p className="text-muted-foreground mb-3 text-sm">
                                                                        No
                                                                        content
                                                                        yet. Add
                                                                        your
                                                                        first
                                                                        item:
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                                                        {ITEM_TYPES.map(
                                                                            (
                                                                                itemType,
                                                                            ) => (
                                                                                <Button
                                                                                    key={
                                                                                        itemType.type
                                                                                    }
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="rounded-lg bg-transparent"
                                                                                    onClick={() =>
                                                                                        addLessonItem(
                                                                                            moduleIndex,
                                                                                            lessonIndex,
                                                                                            itemType.type,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <itemType.icon
                                                                                        className={`mr-1.5 h-3.5 w-3.5 ${itemType.color}`}
                                                                                    />
                                                                                    {
                                                                                        itemType.label
                                                                                    }
                                                                                </Button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1 py-2">
                                                                    {lesson.items.map(
                                                                        (
                                                                            item,
                                                                            itemIndex,
                                                                        ) => {
                                                                            const config =
                                                                                getItemConfig(
                                                                                    item.item_type,
                                                                                );
                                                                            const isEditing =
                                                                                editingItem?.moduleIndex ===
                                                                                moduleIndex &&
                                                                                editingItem?.lessonIndex ===
                                                                                lessonIndex &&
                                                                                editingItem?.itemIndex ===
                                                                                itemIndex;

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        item.id
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors ${isEditing
                                                                                            ? 'bg-primary/10 border-primary border'
                                                                                            : 'hover:bg-muted/50'
                                                                                            }`}
                                                                                        onClick={() =>
                                                                                            setEditingItem(
                                                                                                isEditing
                                                                                                    ? null
                                                                                                    : {
                                                                                                        moduleIndex,
                                                                                                        lessonIndex,
                                                                                                        itemIndex,
                                                                                                    },
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <div
                                                                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
                                                                                        >
                                                                                            <config.icon
                                                                                                className={`h-4 w-4 ${config.color}`}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="min-w-0 flex-1">
                                                                                            <p className="truncate text-sm font-medium">
                                                                                                {item.title ||
                                                                                                    `New ${config.label}`}
                                                                                            </p>
                                                                                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                                                                                <span>
                                                                                                    {
                                                                                                        config.label
                                                                                                    }
                                                                                                </span>
                                                                                                {item.is_preview && (
                                                                                                    <Badge
                                                                                                        variant="secondary"
                                                                                                        className="h-4 px-1 text-[10px]"
                                                                                                    >
                                                                                                        <Eye className="mr-0.5 h-2.5 w-2.5" />
                                                                                                        Preview
                                                                                                    </Badge>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                                                                            onClick={(
                                                                                                e,
                                                                                            ) => {
                                                                                                e.stopPropagation();
                                                                                                removeLessonItem(
                                                                                                    moduleIndex,
                                                                                                    lessonIndex,
                                                                                                    itemIndex,
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <Trash2 className="text-muted-foreground hover:text-destructive h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                    </div>

                                                                                    {/* Inline Editor */}
                                                                                    {isEditing && (
                                                                                        <div className="mt-2 mb-3 ml-11">
                                                                                            <LessonItemEditor
                                                                                                form={
                                                                                                    form
                                                                                                }
                                                                                                moduleIndex={
                                                                                                    moduleIndex
                                                                                                }
                                                                                                lessonIndex={
                                                                                                    lessonIndex
                                                                                                }
                                                                                                itemIndex={
                                                                                                    itemIndex
                                                                                                }
                                                                                                onClose={() =>
                                                                                                    setEditingItem(
                                                                                                        null,
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}

                                                                    {/* Add more items button */}
                                                                    <div className="pt-2">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-muted-foreground h-8"
                                                                                >
                                                                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                                                                    Add
                                                                                    Content
                                                                                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent
                                                                                align="start"
                                                                                className="rounded-xl"
                                                                            >
                                                                                {ITEM_TYPES.map(
                                                                                    (
                                                                                        itemType,
                                                                                    ) => (
                                                                                        <DropdownMenuItem
                                                                                            key={
                                                                                                itemType.type
                                                                                            }
                                                                                            onClick={() =>
                                                                                                addLessonItem(
                                                                                                    moduleIndex,
                                                                                                    lessonIndex,
                                                                                                    itemType.type,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <itemType.icon
                                                                                                className={`mr-2 h-4 w-4 ${itemType.color}`}
                                                                                            />
                                                                                            {
                                                                                                itemType.label
                                                                                            }
                                                                                        </DropdownMenuItem>
                                                                                    ),
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            {/* Add Lesson Button */}
                                            <div className="p-3 pl-16">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary h-8"
                                                    onClick={() =>
                                                        addLesson(moduleIndex)
                                                    }
                                                >
                                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                                    Add Lesson
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>

            {/* Tips */}
            {modules.length > 0 && (
                <Card className="border-border bg-primary/5 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <h4 className="text-foreground mb-1 font-medium">
                                    Curriculum Tips
                                </h4>
                                <ul className="text-muted-foreground space-y-1 text-sm">
                                    <li>
                                        Keep video lectures under 15 minutes for
                                        better engagement
                                    </li>
                                    <li>
                                        Add quizzes after every 3-4 lessons to
                                        reinforce learning
                                    </li>
                                    <li>
                                        Mark introductory content as preview to
                                        attract students
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
