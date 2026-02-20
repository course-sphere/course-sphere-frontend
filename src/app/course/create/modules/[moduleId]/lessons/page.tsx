'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { VideoEditor } from '@/components/course-builder/editors/video-editor';
import { ReadingEditor } from '@/components/course-builder/editors/reading-editor';
import { CodingEditor } from '@/components/course-builder/editors/coding-editor';
import { FileEditor } from '@/components/course-builder/editors/file-editor';
import { QuizEditor } from '@/components/course-builder/editors/quiz-editor';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';

import { SortableList } from '@/components/ui/sortable-list';

import {
    ArrowLeft,
    Plus,
    Loader2,
    GripVertical,
    MoreVertical,
    Pencil,
    Trash2,
    Video,
    FileText,
    HelpCircle,
    Code,
    File as FileIcon,
    ChevronDown,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/fake-data';
import {
    type DraftLesson,
    type DraftLessonItem,
    type LessonItemType,
} from '@/lib/service/lesson';
import { Module } from '@/lib/service/module';
import { generateId } from '@/lib/utils';
/*
 * TODO: API INTEGRATION (PHASE 3 - LESSON MANAGER)
 *
 * 1. LESSON CRUD (handleSaveLesson & handleDeleteLesson):
 * - CREATE: POST /api/v1/modules/{moduleId}/lessons -> Body: { title, sort_order }
 * *CRITICAL: Must replace local generateId() with the real DB ID immediately so child items can be attached to it.*
 * - UPDATE: PUT /api/v1/lessons/{lessonId} -> Body: { title }
 * - DELETE: DELETE /api/v1/lessons/{lessonId}
 * - REORDER: PUT /api/v1/modules/{moduleId}/lessons/reorder -> Body: [{ id, sort_order }]
 *
 * 2. DATA FETCHING:
 * - On page mount, fetch lessons via GET /api/v1/modules/{moduleId}/lessons
 * - Remove the complex nested saveToLocal() logic that patches the course_modules_data array in localStorage.
 */
export default function LessonManagerPage() {
    const params = useParams<{ moduleId: string }>();
    const router = useRouter();
    const user = getCurrentUser('teacher');

    const [isLoading, setIsLoading] = useState(true);
    const [moduleData, setModuleData] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<DraftLesson[]>([]);

    const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<DraftLesson | null>(
        null,
    );

    const [isMaterialSheetOpen, setIsMaterialSheetOpen] = useState(false);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [activeMaterialType, setActiveMaterialType] =
        useState<LessonItemType | null>(null);
    const [editingMaterial, setEditingMaterial] =
        useState<DraftLessonItem | null>(null);

    useEffect(() => {
        const storedCourseId = localStorage.getItem('course_draft_id');
        if (!storedCourseId) {
            router.replace('/course/create');
            return;
        }

        const timer = setTimeout(() => {
            const savedModulesStr = localStorage.getItem('course_modules_data');
            if (savedModulesStr) {
                const modules: Module[] = JSON.parse(savedModulesStr);
                const currentModule = modules.find(
                    (m) => m.id === params.moduleId,
                );

                if (currentModule) {
                    setModuleData(currentModule);
                    setLessons(
                        (currentModule.lessons as unknown as DraftLesson[]) ||
                            [],
                    );
                } else {
                    router.push('/course/create/modules');
                }
            }
            setIsLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [params.moduleId, router]);

    const saveToLocal = (newLessons: DraftLesson[]) => {
        setLessons(newLessons);

        const savedModulesStr = localStorage.getItem('course_modules_data');
        if (savedModulesStr && moduleData) {
            const modules: Module[] = JSON.parse(savedModulesStr);
            const updatedModules = modules.map((m) =>
                m.id === moduleData.id
                    ? { ...m, lessons: newLessons as unknown as DraftLesson[] }
                    : m,
            );
            localStorage.setItem(
                'course_modules_data',
                JSON.stringify(updatedModules),
            );
        }
    };

    const handleReorderLessons = (reordered: DraftLesson[]) => {
        saveToLocal(
            reordered.map((l, index) => ({ ...l, sort_order: index + 1 })),
        );
    };

    const handleSaveLesson = (title: string) => {
        if (editingLesson) {
            console.log('Payload Update:', { title });
            saveToLocal(
                lessons.map((l) =>
                    l.id === editingLesson.id ? { ...l, title } : l,
                ),
            );
        } else {
            const createPayload = {
                module_id: moduleData?.id,
                title,
                sort_order: lessons.length + 1,
            };

            console.log('Payload Create:', createPayload);

            const newLesson: DraftLesson = {
                id: generateId('lesson'),
                title,
                sort_order: lessons.length + 1,
                items: [],
            };
            saveToLocal([...lessons, newLesson]);
        }
        setIsLessonDialogOpen(false);
    };

    const handleDeleteLesson = (id: string) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            saveToLocal(lessons.filter((l) => l.id !== id));
        }
    };

    const handleReorderMaterials = (
        lessonId: string,
        reorderedItems: DraftLessonItem[],
    ) => {
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            sort_order: index + 1,
        }));
        saveToLocal(
            lessons.map((l) =>
                l.id === lessonId ? { ...l, items: updatedItems } : l,
            ),
        );
    };

    const openMaterialSheet = (
        lessonId: string,
        type: LessonItemType,
        itemToEdit: DraftLessonItem | null = null,
    ) => {
        setActiveLessonId(lessonId);
        setActiveMaterialType(type);
        setEditingMaterial(itemToEdit);
        setIsMaterialSheetOpen(true);
    };

    const handleDeleteMaterial = (lessonId: string, itemId: string) => {
        if (confirm('Delete this material?')) {
            saveToLocal(
                lessons.map((l) =>
                    l.id === lessonId
                        ? {
                              ...l,
                              items: l.items.filter((i) => i.id !== itemId),
                          }
                        : l,
                ),
            );
        }
    };

    const handleSaveMaterial = (formData: Record<string, unknown>) => {
        if (!activeLessonId || !activeMaterialType) return;

        const newLessons = lessons.map((lesson) => {
            if (lesson.id !== activeLessonId) return lesson;

            let updatedItems = [...lesson.items];

            const typedData = formData as {
                title: string;
                is_required: boolean;
                is_preview: boolean;
                [key: string]: unknown;
            };

            const { title, is_required, is_preview, ...specificData } =
                typedData;

            if (editingMaterial) {
                updatedItems = updatedItems.map((item) => {
                    if (item.id === editingMaterial.id) {
                        return {
                            ...item,
                            title,
                            is_required,
                            is_preview,
                            [`${activeMaterialType}_data`]: specificData,
                        };
                    }
                    return item;
                });
            } else {
                const newItem: DraftLessonItem = {
                    id: generateId('item'),
                    item_type: activeMaterialType,
                    sort_order: lesson.items.length + 1,
                    title,
                    is_required,
                    is_preview,
                    [`${activeMaterialType}_data`]: specificData,
                };
                updatedItems.push(newItem);
            }
            return { ...lesson, items: updatedItems };
        });

        saveToLocal(newLessons);
        setIsMaterialSheetOpen(false);
    };

    if (isLoading)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );

    return (
        <div className="bg-background min-h-screen">
            <DashboardSidebar
                role="teacher"
                userName={user.name}
                userEmail={user.email}
            />
            <div className="pl-64">
                <DashboardHeader title={`Module: ${moduleData?.title}`} />
                <main className="mx-auto max-w-4xl p-6">
                    <Button variant="ghost" className="mb-6" asChild>
                        <Link href="/course/create/modules">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Modules
                        </Link>
                    </Button>

                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl font-bold">
                                Lessons & Materials
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage content for module:{' '}
                                <span className="text-foreground font-semibold">
                                    {moduleData?.title}
                                </span>
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingLesson(null);
                                setIsLessonDialogOpen(true);
                            }}
                            className="rounded-xl"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Lesson
                        </Button>
                    </div>

                    {lessons.length === 0 ? (
                        <div className="border-border rounded-2xl border-2 border-dashed p-12 text-center">
                            <p className="text-muted-foreground mb-4">
                                No lessons in this module yet.
                            </p>
                            <Button
                                onClick={() => {
                                    setEditingLesson(null);
                                    setIsLessonDialogOpen(true);
                                }}
                                variant="outline"
                            >
                                Add First Lesson
                            </Button>
                        </div>
                    ) : (
                        <SortableList
                            items={lessons}
                            onReorder={handleReorderLessons}
                            renderItem={(lesson, dragHandleProps) => (
                                <LessonCard
                                    lesson={lesson}
                                    dragHandleProps={dragHandleProps}
                                    onEditLesson={() => {
                                        setEditingLesson(lesson);
                                        setIsLessonDialogOpen(true);
                                    }}
                                    onDeleteLesson={() =>
                                        handleDeleteLesson(lesson.id)
                                    }
                                    onReorderMaterials={(
                                        newItems: DraftLessonItem[],
                                    ) =>
                                        handleReorderMaterials(
                                            lesson.id,
                                            newItems,
                                        )
                                    }
                                    onAddMaterial={(type: LessonItemType) =>
                                        openMaterialSheet(lesson.id, type)
                                    }
                                    onEditMaterial={(item: DraftLessonItem) =>
                                        openMaterialSheet(
                                            lesson.id,
                                            item.item_type,
                                            item,
                                        )
                                    }
                                    onDeleteMaterial={(itemId: string) =>
                                        handleDeleteMaterial(lesson.id, itemId)
                                    }
                                />
                            )}
                        />
                    )}
                </main>
            </div>

            <LessonFormDialog
                open={isLessonDialogOpen}
                onOpenChange={setIsLessonDialogOpen}
                initialData={editingLesson}
                onSubmit={handleSaveLesson}
            />

            <MaterialSheet
                open={isMaterialSheetOpen}
                onOpenChange={setIsMaterialSheetOpen}
                type={activeMaterialType}
                initialData={editingMaterial}
                onSave={handleSaveMaterial}
            />
        </div>
    );
}

interface LessonCardProps {
    lesson: DraftLesson;
    dragHandleProps: Record<string, unknown> | undefined;
    onEditLesson: () => void;
    onDeleteLesson: () => void;
    onReorderMaterials: (newItems: DraftLessonItem[]) => void;
    onAddMaterial: (type: LessonItemType) => void;
    onEditMaterial: (item: DraftLessonItem) => void;
    onDeleteMaterial: (itemId: string) => void;
}

function LessonCard({
    lesson,
    dragHandleProps,
    onEditLesson,
    onDeleteLesson,
    onReorderMaterials,
    onAddMaterial,
    onEditMaterial,
    onDeleteMaterial,
}: LessonCardProps) {
    const MATERIAL_TYPES: {
        type: LessonItemType;
        label: string;
        icon: React.ElementType; // FIX LỖI TẠI ĐÂY: Khai báo icon là một component của React
        color: string;
    }[] = [
        { type: 'video', label: 'Video', icon: Video, color: 'text-blue-500' },
        {
            type: 'reading',
            label: 'Reading',
            icon: FileText,
            color: 'text-green-500',
        },
        {
            type: 'quiz',
            label: 'Quiz',
            icon: HelpCircle,
            color: 'text-purple-500',
        },
        {
            type: 'coding',
            label: 'Coding',
            icon: Code,
            color: 'text-orange-500',
        },
        { type: 'file', label: 'File', icon: FileIcon, color: 'text-gray-500' },
    ];

    return (
        <div className="bg-card border-border mb-4 overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 border-border flex items-center border-b p-3">
                <div
                    {...dragHandleProps}
                    className="text-muted-foreground hover:text-foreground cursor-grab px-2 py-2"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
                <div className="mr-3 text-sm font-semibold">
                    Lesson {lesson.sort_order}:
                </div>
                <div className="flex-1 truncate font-medium">
                    {lesson.title}
                </div>

                <div className="flex items-center gap-2 pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg"
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                                Content{' '}
                                <ChevronDown className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl"
                        >
                            {MATERIAL_TYPES.map((t) => (
                                <DropdownMenuItem
                                    key={t.type}
                                    onClick={() => onAddMaterial(t.type)}
                                >
                                    <t.icon
                                        className={`mr-2 h-4 w-4 ${t.color}`}
                                    />{' '}
                                    {t.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={onEditLesson}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Title
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={onDeleteLesson}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                Lesson
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="bg-background p-3 pl-12">
                {lesson.items.length === 0 ? (
                    <div className="text-muted-foreground py-2 text-xs italic">
                        Empty lesson. Add content from the button above.
                    </div>
                ) : (
                    <SortableList
                        items={lesson.items}
                        onReorder={onReorderMaterials}
                        renderItem={(item: DraftLessonItem, dragProps) => {
                            const config =
                                MATERIAL_TYPES.find(
                                    (t) => t.type === item.item_type,
                                ) || MATERIAL_TYPES[0];
                            return (
                                <div className="hover:bg-muted/50 group hover:border-border flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors">
                                    <div
                                        {...dragProps}
                                        className="text-muted-foreground/30 group-hover:text-muted-foreground cursor-grab"
                                    >
                                        <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div
                                        className={`bg-muted rounded-md p-1.5 ${config.color}`}
                                    >
                                        <config.icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="cursor-pointer truncate text-sm font-medium hover:underline"
                                            onClick={() => onEditMaterial(item)}
                                        >
                                            {item.title}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10 h-7 w-7 opacity-0 group-hover:opacity-100"
                                        onClick={() =>
                                            onDeleteMaterial(item.id)
                                        }
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
}

interface LessonFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: DraftLesson | null;
    onSubmit: (title: string) => void;
}

function LessonFormDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: LessonFormDialogProps) {
    const form = useForm({ defaultValues: { title: '' } });
    useEffect(() => {
        if (open) form.reset({ title: initialData?.title || '' });
    }, [open, initialData, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Rename Lesson' : 'Add New Lesson'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((v) => onSubmit(v.title))}
                        className="space-y-4 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Introduction to React"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="rounded-xl">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface MaterialSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: LessonItemType | null;
    initialData: DraftLessonItem | null;
    onSave: (data: Record<string, unknown>) => void;
}

function MaterialSheet({
    open,
    onOpenChange,
    type,
    initialData,
    onSave,
}: MaterialSheetProps) {
    const renderEditor = () => {
        const props = {
            initialData,
            onSave,
            onCancel: () => onOpenChange(false),
        };

        switch (type) {
            case 'video':
                return <VideoEditor {...props} />;
            case 'reading':
                return <ReadingEditor {...props} />;
            case 'coding':
                return <CodingEditor {...props} />;
            case 'quiz':
                return <QuizEditor {...props} />;
            case 'file':
                return <FileEditor {...props} />;
            default:
                return (
                    <div className="bg-muted/30 text-muted-foreground mt-10 rounded-xl border-2 border-dashed p-4 text-center">
                        Editor for{' '}
                        <strong className="text-primary uppercase">
                            {type}
                        </strong>{' '}
                        is under construction.
                    </div>
                );
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-background z-100 flex h-dvh w-full flex-col overflow-hidden border-none p-0 sm:max-w-[100vw]">
                <div className="border-border bg-card relative shrink-0 border-b px-8 py-5">
                    <SheetHeader className="space-y-1 pr-8 text-left">
                        <SheetTitle className="text-2xl font-bold">
                            {initialData ? 'Edit' : 'Create'}{' '}
                            <span className="text-primary">
                                {type
                                    ? type.charAt(0).toUpperCase() +
                                      type.slice(1)
                                    : 'Content'}
                            </span>
                        </SheetTitle>
                        <SheetDescription className="text-base">
                            Configure the settings and build your content here.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="bg-muted/20 flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="bg-card border-border mx-auto max-w-5xl rounded-2xl border p-6 shadow-sm md:p-8">
                        {renderEditor()}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
