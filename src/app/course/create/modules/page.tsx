'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    FormMessage,
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    ArrowLeft,
    Plus,
    Loader2,
    GripVertical,
    MoreVertical,
    Pencil,
    Trash2,
    BookOpen,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/fake-data';
import { PhaseIndicator } from '@/components/course-builder/phase-indicator';
import { PHASES } from '@/components/course-builder/constant';
import { Module, ModuleFormValues, moduleSchema } from '@/lib/service/module';

const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function ModuleBuilderPage() {
    const router = useRouter();
    const user = getCurrentUser('teacher');

    const [isLoading, setIsLoading] = useState(true);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [modules, setModules] = useState<Module[]>([]);

    // State cho Modal Tạo/Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);

    // Load data ban đầu
    useEffect(() => {
        const storedCourseId = localStorage.getItem('course_draft_id');
        if (!storedCourseId) {
            router.replace('/course/create');
            return;
        }
        setCourseId(storedCourseId);

        const savedModulesStr = localStorage.getItem('course_modules_data');
        if (savedModulesStr) {
            setModules(JSON.parse(savedModulesStr));
        }
        setIsLoading(false);
    }, [router]);

    const saveToLocal = (newModules: Module[]) => {
        setModules(newModules);
        localStorage.setItem('course_modules_data', JSON.stringify(newModules));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = modules.findIndex((m) => m.id === active.id);
            const newIndex = modules.findIndex((m) => m.id === over.id);

            let newArray = arrayMove(modules, oldIndex, newIndex);
            newArray = newArray.map((mod, index) => ({
                ...mod,
                sort_order: index + 1,
            }));
            saveToLocal(newArray);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this module?')) {
            const newArray = modules.filter((m) => m.id !== id);
            saveToLocal(newArray);
        }
    };

    const openCreateDialog = () => {
        setEditingModule(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (module: Module) => {
        setEditingModule(module);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = (values: ModuleFormValues) => {
        if (editingModule) {
            const newArray = modules.map((m) =>
                m.id === editingModule.id ? { ...m, ...values } : m,
            );
            saveToLocal(newArray);
        } else {
            const newModule: Module = {
                id: generateId('module'),
                course_id: courseId as string,
                title: values.title,
                description: values.description || '',
                sort_order: modules.length + 1,
                status: 'draft',
                lessons: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            saveToLocal([...modules, newModule]);
        }
        setIsDialogOpen(false);
    };

    if (isLoading)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary animate-spin" />
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
                <DashboardHeader title="Module Builder" />
                <main className="p-6">
                    <Button variant="ghost" className="mb-6" asChild>
                        <Link href="/course/create">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Course Info
                        </Link>
                    </Button>

                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h1 className="text-foreground text-2xl font-bold">
                                    Build Your Modules
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Organize your course into broad topics or
                                    weeks.
                                </p>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                className="rounded-xl"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Module
                            </Button>
                        </div>

                        <PhaseIndicator
                            phases={PHASES}
                            currentPhase={2}
                            className="mb-8"
                        />

                        {modules.length === 0 ? (
                            <div className="border-border rounded-2xl border-2 border-dashed p-12 text-center">
                                <h3 className="text-lg font-medium">
                                    No modules yet
                                </h3>
                                <p className="text-muted-foreground mt-1 mb-4">
                                    Get started by creating your first course
                                    module.
                                </p>
                                <Button
                                    onClick={openCreateDialog}
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    Create Module
                                </Button>
                            </div>
                        ) : (
                            <ModuleDnDList
                                modules={modules}
                                onDragEnd={handleDragEnd}
                                onEdit={openEditDialog}
                                onDelete={handleDelete}
                                onManageLessons={(id) =>
                                    router.push(
                                        `/course/create/modules/${id}/lessons`,
                                    )
                                }
                            />
                        )}
                    </div>
                </main>
            </div>

            <ModuleFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingModule}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}

function ModuleDnDList({
    modules,
    onDragEnd,
    onEdit,
    onDelete,
    onManageLessons,
}: {
    modules: Module[];
    onDragEnd: (e: DragEndEvent) => void;
    onEdit: (m: Module) => void;
    onDelete: (id: string) => void;
    onManageLessons: (id: string) => void;
}) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <SortableContext
                items={modules.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {modules.map((module) => (
                        <SortableModuleItem
                            key={module.id}
                            module={module}
                            onEdit={() => onEdit(module)}
                            onDelete={() => onDelete(module.id)}
                            onManageLessons={() => onManageLessons(module.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableModuleItem({
    module,
    onEdit,
    onDelete,
    onManageLessons,
}: {
    module: Module;
    onEdit: () => void;
    onDelete: () => void;
    onManageLessons: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-card border-border flex items-center rounded-xl border p-3 shadow-sm transition-all ${isDragging ? 'ring-primary opacity-50 ring-2' : 'hover:shadow-md'}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="text-muted-foreground hover:text-foreground cursor-grab px-2 py-2"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold">
                {module.sort_order}
            </div>

            <div className="ml-4 flex-1 truncate">
                <h3 className="truncate font-medium">{module.title}</h3>
                {module.description && (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {module.description}
                    </p>
                )}
            </div>

            <div className="ml-4 flex items-center gap-2 pr-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onManageLessons}
                    className="rounded-lg"
                >
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Manage Lessons
                </Button>

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
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Module Info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-destructive focus:bg-destructive/10"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Module
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

function ModuleFormDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: Module | null;
    onSubmit: (values: ModuleFormValues) => void;
}) {
    const form = useForm<ModuleFormValues>({
        resolver: zodResolver(moduleSchema),
        defaultValues: { title: '', description: '' },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: initialData?.title || '',
                description: initialData?.description || '',
            });
        }
    }, [open, initialData, form]);

    const handleSubmit = (values: ModuleFormValues) => {
        onSubmit(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Module' : 'Create New Module'}
                    </DialogTitle>
                    <DialogDescription>
                        Modules act as sections or weeks to group your lessons.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Module Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Week 1: Getting Started"
                                            className="rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Briefly describe this module"
                                            className="rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="rounded-xl">
                                {initialData ? 'Save Changes' : 'Create Module'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
