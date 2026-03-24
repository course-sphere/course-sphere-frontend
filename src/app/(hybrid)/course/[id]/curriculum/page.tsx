'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    PlayCircle,
    FileText,
    Code,
    HelpCircle,
    GripVertical,
    Trash2,
    LayoutTemplate,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { VideoEditor } from '@/components/course-builder/editors/video-editor';
import { ReadingEditor } from '@/components/course-builder/editors/reading-editor';
import { CodingEditor } from '@/components/course-builder/editors/coding-editor';
import { FileEditor } from '@/components/course-builder/editors/file-editor';
import { QuizEditor } from '@/components/course-builder/editors/quiz-editor';
import { InlineTextEdit } from '@/components/course-builder/inline-edit/inline-text-edit';
import { EmptyState } from '@/components/ui/empty-state';

import {
    type DraftLessonItem,
    type LessonItemType,
} from '@/lib/service/lesson';

import { useCurriculumStore } from '@/lib/stores/use-curriculum-store';
import {
    useGetCurriculum,
    useCreateMaterial,
    useUpdateMaterial,
    useDeleteMaterial,
    useMoveMaterial,
    mapTypeToKind,
} from '@/lib/service/curriculum/api';
import { useUpdateCourse } from '@/lib/service/course';
import { toast } from 'sonner';

const MATERIAL_CONFIG: Record<
    LessonItemType,
    { icon: React.ElementType; color: string; bgColor: string }
> = {
    video: {
        icon: PlayCircle,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    reading: {
        icon: FileText,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    coding: {
        icon: Code,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
    },
    quiz: {
        icon: HelpCircle,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    file: {
        icon: FileText,
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/10',
    },
};

export default function CurriculumManagerPage() {
    const router = useRouter();
    const { id: courseId } = useParams() as { id: string };

    const { data: fetchedLessons, isLoading } = useGetCurriculum(courseId);
    const createMatMutation = useCreateMaterial(courseId);
    const updateMatMutation = useUpdateMaterial(courseId);
    const deleteMatMutation = useDeleteMaterial(courseId);
    const moveMatMutation = useMoveMaterial(courseId);
    const updateCourseMutation = useUpdateCourse(courseId);

    const handlePublish = async () => {
        try {
            await updateCourseMutation.mutateAsync({ status: 'reviewing' });
            toast.success(
                'The course has been submitted and is awaiting approval!',
            );
            router.push(`/`);
        } catch (error) {
            console.error('Lỗi khi publish:', error);
            toast.error('Có lỗi xảy ra khi submit!');
        }
    };

    const store = useCurriculumStore();
    const [activeDragItem, setActiveDragItem] =
        useState<DraftLessonItem | null>(null);

    const setLessons = useCurriculumStore((state) => state.setLessons);

    useEffect(() => {
        if (fetchedLessons) {
            setLessons(fetchedLessons);
        }
    }, [fetchedLessons, setLessons]);

    const activeMaterial = useMemo(() => {
        if (!store.activeLessonId || !store.activeMaterialId) return null;
        const lesson = store.lessons.find((l) => l.id === store.activeLessonId);
        return (
            lesson?.items.find((m) => m.id === store.activeMaterialId) || null
        );
    }, [store.lessons, store.activeLessonId, store.activeMaterialId]);

    const handleAddMaterial = async (
        lessonId: string,
        type: LessonItemType,
    ) => {
        const lesson = store.lessons.find((l) => l.id === lessonId);
        if (!lesson) return;

        const defaultTitle = `New ${type}`;

        try {
            const materialIdString = await createMatMutation.mutateAsync({
                title: defaultTitle,
                kind: mapTypeToKind(type),
                lesson: lesson.title || 'Untitled Section',
                is_required: false,
                required_peers: 0,
                required_score: 0,
            });

            const newLessons = store.lessons.map((l) => {
                if (l.id === lessonId) {
                    return {
                        ...l,
                        items: [
                            ...l.items,
                            {
                                id: materialIdString,
                                title: defaultTitle,
                                item_type: type,
                                sort_order: l.items.length + 1,
                                is_required: false,
                                is_preview: false,
                            },
                        ],
                    };
                }
                return l;
            });

            store.setLessons(newLessons);
            store.setActiveItem(lessonId, materialIdString);
        } catch (error) {
            console.error('Failed to create', error);
        }
    };

    const handleUpdateMaterialTitle = async (
        lessonId: string,
        materialId: string,
        newTitle: string,
    ) => {
        store.updateMaterialTitle(lessonId, materialId, newTitle);
        await updateMatMutation.mutateAsync({
            materialId,
            payload: { title: newTitle },
        });
    };

    const handleDeleteMaterial = async (
        lessonId: string,
        materialId: string,
    ) => {
        store.deleteMaterial(lessonId, materialId);
        await deleteMatMutation.mutateAsync(materialId);
    };

    interface MaterialFormData {
        title?: string;
        content?: string;
        file_url?: string;
        video_url?: string;
        description?: string;
        is_required?: boolean;
        [key: string]: unknown;
    }

    const handleSaveContent = async (formData: MaterialFormData) => {
        if (!store.activeLessonId || !store.activeMaterialId || !activeMaterial)
            return;
        const currentLesson = store.lessons.find(
            (l) => l.id === store.activeLessonId,
        );
        const lessonName = currentLesson?.title || 'Untitled Section';

        let contentString = '';

        if (activeMaterial.item_type === 'reading') {
            contentString = formData.content || '';
        } else if (activeMaterial.item_type === 'file') {
            contentString = formData.file_url || '';
        } else if (activeMaterial.item_type === 'video') {
            const videoUrl = formData.video_url || '';
            const videoDesc = formData.description || '';
            contentString = `${videoUrl}-${videoDesc}`;
        }

        store.updateMaterialData(store.activeLessonId, store.activeMaterialId, {
            [`${activeMaterial.item_type}_data`]: formData,
        });
        if (formData.title && formData.title !== activeMaterial.title) {
            store.updateMaterialTitle(
                store.activeLessonId,
                store.activeMaterialId,
                formData.title,
            );
        }
        try {
            await updateMatMutation.mutateAsync({
                materialId: store.activeMaterialId,
                payload: {
                    title: formData.title || activeMaterial.title,
                    lesson: lessonName,
                    content: contentString,
                    is_required:
                        formData.is_required ?? activeMaterial.is_required,
                    required_peers: 0,
                    required_score: 0,
                },
            });
        } catch (error) {
            console.error('Failed to save content', error);
        }
    };
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const onDragStart = (event: DragStartEvent) => {
        const item = store.lessons
            .flatMap((l) => l.items)
            .find((i) => i.id === event.active.id);
        if (item) setActiveDragItem(item);
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const sIdx = store.lessons.findIndex((l) =>
            l.items.some((i) => i.id === activeId),
        );
        let tIdx = store.lessons.findIndex((l) =>
            l.items.some((i) => i.id === overId),
        );
        if (tIdx === -1) tIdx = store.lessons.findIndex((l) => l.id === overId);

        if (sIdx !== tIdx && sIdx !== -1 && tIdx !== -1) {
            const newLessons = [...store.lessons];
            const sItems = [...newLessons[sIdx].items];
            const tItems = [...newLessons[tIdx].items];

            const itemIdx = sItems.findIndex((i) => i.id === activeId);
            const item = sItems.splice(itemIdx, 1)[0];

            const overItemIdx = tItems.findIndex((i) => i.id === overId);
            tItems.splice(
                overItemIdx >= 0 ? overItemIdx : tItems.length,
                0,
                item,
            );

            newLessons[sIdx] = { ...newLessons[sIdx], items: sItems };
            newLessons[tIdx] = { ...newLessons[tIdx], items: tItems };
            store.setLessons(newLessons);
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveDragItem(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const lessonIdx = store.lessons.findIndex((l) =>
            l.items.some((i) => i.id === activeId),
        );
        if (lessonIdx === -1) return;

        const lesson = store.lessons[lessonIdx];
        const activeIdx = lesson.items.findIndex((i) => i.id === activeId);
        const overIdx = lesson.items.findIndex((i) => i.id === overId);

        if (activeIdx !== overIdx && overIdx !== -1) {
            const newLessons = [...store.lessons];
            newLessons[lessonIdx] = {
                ...lesson,
                items: arrayMove(lesson.items, activeIdx, overIdx),
            };
            store.setLessons(newLessons);

            const sortedItems = newLessons[lessonIdx].items;
            const newActiveIdx = sortedItems.findIndex(
                (i) => i.id === activeId,
            );

            const prev_id =
                newActiveIdx > 0 ? sortedItems[newActiveIdx - 1].id : '';
            const next_id =
                newActiveIdx < sortedItems.length - 1
                    ? sortedItems[newActiveIdx + 1].id
                    : '';

            moveMatMutation.mutate({
                materialId: activeId,
                payload: {
                    prev_id: prev_id,
                    next_id: next_id,
                },
            });
        }
    };

    if (isLoading)
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
            </div>
        );

    return (
        <div className="bg-background flex h-screen w-screen overflow-hidden">
            <div className="border-border bg-sidebar z-20 flex h-full w-87.5 shrink-0 flex-col border-r shadow-lg lg:w-100">
                <div className="border-border bg-card flex h-16 shrink-0 items-center gap-3 border-b px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-muted h-9 w-9 rounded-full"
                        onClick={() =>
                            router.push(`/course/${courseId}/overview`)
                        }
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm leading-none font-bold">
                            Curriculum Builder
                        </h2>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Course Sphere
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-x-hidden overflow-y-auto p-5">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
                    >
                        <div className="space-y-8 pb-20">
                            {store.lessons.map((lesson, index) => (
                                <div key={lesson.id} className="space-y-3">
                                    <div className="group flex items-center">
                                        <div className="text-sidebar-foreground/70 mr-2 shrink-0 text-sm font-bold">
                                            Lesson {index + 1}:
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <InlineTextEdit
                                                value={lesson.title}
                                                onSave={async (val) =>
                                                    store.updateLessonTitle(
                                                        lesson.id,
                                                        val,
                                                    )
                                                }
                                                textClassName="text-sm font-bold truncate hover:bg-muted px-1.5 py-0.5 -ml-1.5 rounded transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <SortableContext
                                        items={lesson.items.map((i) => i.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="min-h-2.5 space-y-1.5">
                                            {lesson.items.map((item) => (
                                                <DraggableMaterialItem
                                                    key={item.id}
                                                    item={item}
                                                    lessonId={lesson.id}
                                                    isActive={
                                                        store.activeMaterialId ===
                                                        item.id
                                                    }
                                                    onClick={() =>
                                                        store.setActiveItem(
                                                            lesson.id,
                                                            item.id,
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteMaterial(
                                                            lesson.id,
                                                            item.id,
                                                        )
                                                    }
                                                    onRename={(val) =>
                                                        handleUpdateMaterialTitle(
                                                            lesson.id,
                                                            item.id,
                                                            val,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>

                                    <div className="pt-1 pl-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-muted-foreground hover:text-foreground hover:border-primary/50 h-9 w-full justify-start rounded-xl border-dashed transition-all"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />{' '}
                                                    Add Material
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="start"
                                                className="w-48 rounded-xl shadow-lg"
                                            >
                                                {(
                                                    Object.keys(
                                                        MATERIAL_CONFIG,
                                                    ) as LessonItemType[]
                                                ).map((type) => {
                                                    const {
                                                        icon: Icon,
                                                        color,
                                                        bgColor,
                                                    } = MATERIAL_CONFIG[type];
                                                    return (
                                                        <DropdownMenuItem
                                                            key={type}
                                                            onClick={() =>
                                                                handleAddMaterial(
                                                                    lesson.id,
                                                                    type,
                                                                )
                                                            }
                                                            className="cursor-pointer py-2 font-medium capitalize"
                                                        >
                                                            <div
                                                                className={`rounded-md p-1.5 ${bgColor} mr-3`}
                                                            >
                                                                <Icon
                                                                    className={`h-4 w-4 ${color}`}
                                                                />
                                                            </div>
                                                            {type}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="secondary"
                                className="mt-8 h-12 w-full rounded-xl border-2 border-dashed font-bold"
                                onClick={store.addLesson}
                            >
                                <Plus className="mr-2 h-5 w-5" /> Add New Lesson
                            </Button>
                        </div>

                        <DragOverlay
                            dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: { active: { opacity: '0.4' } },
                                }),
                            }}
                        >
                            {activeDragItem
                                ? (() => {
                                      const dragConfig =
                                          MATERIAL_CONFIG[
                                              activeDragItem.item_type as LessonItemType
                                          ] || MATERIAL_CONFIG.file;
                                      return (
                                          <div className="bg-primary/5 border-primary/30 flex cursor-grabbing items-center gap-2 rounded-xl border p-2.5 opacity-90 shadow-2xl backdrop-blur-sm">
                                              <GripVertical className="text-primary h-4 w-4 shrink-0" />
                                              <div
                                                  className={`rounded-md p-1.5 ${dragConfig.bgColor}`}
                                              >
                                                  <dragConfig.icon
                                                      className={`h-4 w-4 ${dragConfig.color}`}
                                                  />
                                              </div>
                                              <span className="text-primary text-sm font-medium">
                                                  {activeDragItem.title}
                                              </span>
                                          </div>
                                      );
                                  })()
                                : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950/50">
                <div className="border-border bg-background z-10 flex h-16 shrink-0 items-center justify-between border-b px-8 shadow-sm">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                        {activeMaterial ? (
                            <>
                                <span>
                                    {
                                        store.lessons.find(
                                            (l) =>
                                                l.id === store.activeLessonId,
                                        )?.title
                                    }
                                </span>
                                <span className="text-border mx-1">/</span>
                                <span className="text-foreground">
                                    {activeMaterial.title}
                                </span>
                            </>
                        ) : (
                            'Workspace'
                        )}
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="rounded-full px-6 font-semibold shadow-md"
                        onClick={handlePublish}
                        disabled={updateCourseMutation.isPending}
                    >
                        {updateCourseMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Publish Changes
                    </Button>{' '}
                </div>

                <div className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth p-6 pb-32 lg:p-10">
                    <div className="mx-auto max-w-4xl">
                        {!activeMaterial ? (
                            <div className="flex h-[60vh] items-center justify-center">
                                <EmptyState
                                    title="Select an item to edit"
                                    description="Click on any material in the syllabus sidebar to configure its content, or add a new material to get started."
                                    icons={[LayoutTemplate]}
                                    className="border-none bg-transparent shadow-none"
                                />
                            </div>
                        ) : (
                            (() => {
                                const activeConfig =
                                    MATERIAL_CONFIG[
                                        activeMaterial.item_type as LessonItemType
                                    ] || MATERIAL_CONFIG.file;
                                return (
                                    <div className="animate-in fade-in zoom-in-95 space-y-6 duration-300">
                                        <div className="border-border/60 mb-8 border-b pb-5 pl-1">
                                            <div
                                                className={`mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${activeConfig.color}`}
                                            >
                                                {React.createElement(
                                                    activeConfig.icon,
                                                    { className: 'h-4 w-4' },
                                                )}{' '}
                                                {activeMaterial.item_type}{' '}
                                                Editor
                                            </div>
                                            <h1 className="text-foreground text-4xl font-extrabold tracking-tight">
                                                {activeMaterial.title}
                                            </h1>
                                        </div>

                                        <div className="bg-background border-border rounded-2xl border p-6 shadow-xl md:p-8">
                                            {activeMaterial.item_type ===
                                                'video' && (
                                                <VideoEditor
                                                    initialData={activeMaterial}
                                                    onSave={handleSaveContent}
                                                    onCancel={() => {}}
                                                />
                                            )}
                                            {activeMaterial.item_type ===
                                                'reading' && (
                                                <ReadingEditor
                                                    initialData={activeMaterial}
                                                    onSave={handleSaveContent}
                                                    onCancel={() => {}}
                                                />
                                            )}
                                            {activeMaterial.item_type ===
                                                'coding' && (
                                                <CodingEditor
                                                    initialData={activeMaterial}
                                                    onSave={handleSaveContent}
                                                    onCancel={() => {}}
                                                />
                                            )}
                                            {activeMaterial.item_type ===
                                                'file' && (
                                                <FileEditor
                                                    initialData={activeMaterial}
                                                    onSave={handleSaveContent}
                                                    onCancel={() => {}}
                                                />
                                            )}
                                            {activeMaterial.item_type ===
                                                'quiz' && (
                                                <QuizEditor
                                                    initialData={activeMaterial}
                                                    onSave={handleSaveContent}
                                                    onCancel={() => {}}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DraggableMaterialItemProps {
    item: DraftLessonItem;
    lessonId: string;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
    onRename: (val: string) => void;
}

function DraggableMaterialItem({
    item,
    isActive,
    onClick,
    onDelete,
    onRename,
}: DraggableMaterialItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const config =
        MATERIAL_CONFIG[item.item_type as LessonItemType] ||
        MATERIAL_CONFIG.file;
    const Icon = config.icon;

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <div
                className={`group flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 transition-all ${isActive ? 'bg-primary/5 border-primary/30 text-primary shadow-sm' : 'hover:bg-sidebar-accent text-sidebar-foreground/80 border-transparent'}`}
                onClick={onClick}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="shrink-0 cursor-grab opacity-30 outline-none hover:opacity-100!"
                >
                    <GripVertical className="h-4 w-4" />
                </div>

                <div
                    className={`rounded-md p-1.5 ${isActive ? config.bgColor : 'bg-muted group-hover:bg-background'}`}
                >
                    <Icon className={`h-4 w-4 shrink-0 ${config.color}`} />
                </div>

                <div
                    className="min-w-0 flex-1 outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <InlineTextEdit
                        value={item.title}
                        onSave={async (val) => onRename(val)}
                        textClassName={`text-sm truncate hover:underline font-medium ${isActive ? 'text-primary' : ''}`}
                    />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
