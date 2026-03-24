'use client';

import { useState, useMemo, DragEvent } from 'react';
import {
    Search,
    BookOpen,
    ClipboardX,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetAllCourses, CourseResponse } from '@/lib/service/course';
import { COURSE_LEVELS } from '../course-builder/constant';
import { InlineTextEdit } from '../course-builder/inline-edit/inline-text-edit';

interface RoadmapInventoryProps {
    title: string;
    description: string;
    onUpdateTitle: (val: string) => Promise<void>;
    onUpdateDescription: (val: string) => Promise<void>;
    onPublish: () => void;
    isPublishing?: boolean;
}

export function RoadmapInventory({
    title,
    description,
    onUpdateTitle,
    onUpdateDescription,
    onPublish,
    isPublishing = false,
}: RoadmapInventoryProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');

    const debouncedSearch = useDebounce(search, 400);

    const { data: allCourses = [], isLoading } = useGetAllCourses();

    const uniqueCategories = useMemo(() => {
        const catSet = new Set<string>();
        allCourses.forEach((course) => {
            if (course.status === 'approved' && course.categories) {
                course.categories.forEach((cat) => catSet.add(cat));
            }
        });
        return Array.from(catSet);
    }, [allCourses]);

    const filteredCourses = useMemo(() => {
        const approvedCourses = allCourses.filter(
            (course) => course.status === 'approved',
        );

        return approvedCourses.filter((course) => {
            const matchesSearch =
                course.title
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase()) ||
                (course.instructor?.name || '')
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase());

            const matchesCategory =
                selectedCategory === 'all' ||
                (course.categories &&
                    course.categories.includes(selectedCategory));

            const matchesLevel =
                selectedLevel === 'all' || course.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [allCourses, debouncedSearch, selectedCategory, selectedLevel]);

    const onDragStart = (
        event: DragEvent<HTMLDivElement>,
        course: CourseResponse,
    ) => {
        event.dataTransfer.setData(
            'application/reactflow',
            JSON.stringify(course),
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="border-border bg-card z-10 flex h-full w-95 shrink-0 flex-col border-r shadow-sm">
            <div className="border-border bg-background/50 flex flex-col gap-5 border-b p-5">
                <div className="space-y-1">
                    <InlineTextEdit
                        value={title}
                        label="Roadmap Title"
                        onSave={onUpdateTitle}
                        textClassName="text-xl font-bold text-foreground"
                        placeholder="Enter roadmap title..."
                    />
                    <InlineTextEdit
                        type="textarea"
                        value={description}
                        label="Description"
                        onSave={onUpdateDescription}
                        textClassName="text-sm text-muted-foreground line-clamp-3"
                        placeholder="Add a detailed description..."
                    />
                </div>
                <Button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="w-full font-semibold shadow-xs"
                >
                    {isPublishing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Complete & View Roadmaps
                </Button>{' '}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-border bg-card/95 z-10 space-y-3 border-b p-5 pb-4 backdrop-blur">
                    <div>
                        <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
                            Course Inventory
                        </h2>
                        <p className="text-muted-foreground mt-1 text-[11px]">
                            Drag and drop courses to the canvas
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 rounded-lg pl-9 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="h-8 flex-1 rounded-lg text-xs">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {uniqueCategories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedLevel}
                                onValueChange={setSelectedLevel}
                            >
                                <SelectTrigger className="h-8 flex-1 rounded-lg text-xs">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    {COURSE_LEVELS.map((lvl) => (
                                        <SelectItem
                                            key={lvl.value}
                                            value={lvl.value}
                                        >
                                            {lvl.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/10 flex-1 overflow-y-auto p-5 pt-4 pb-20">
                    {' '}
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <EmptyState
                            title="No courses found"
                            description="Try adjusting your filters."
                            icons={[Search, ClipboardX, BookOpen]}
                            className="p-8"
                            action={{
                                label: 'Clear filters',
                                onClick: () => {
                                    setSearch('');
                                    setSelectedCategory('all');
                                    setSelectedLevel('all');
                                },
                            }}
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, course)}
                                    className="border-border hover:border-primary/50 hover:bg-card bg-background group cursor-grab overflow-hidden rounded-xl border p-3 shadow-xs transition-all active:cursor-grabbing"
                                >
                                    <h3
                                        className="group-hover:text-primary truncate text-sm font-semibold transition-colors"
                                        title={course.title}
                                    >
                                        {course.title}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {course.categories &&
                                            course.categories[0] && (
                                                <Badge
                                                    variant="secondary"
                                                    className="max-w-35 truncate text-[10px] font-medium"
                                                    title={course.categories[0]}
                                                >
                                                    {course.categories[0]}
                                                </Badge>
                                            )}
                                        <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-wider uppercase">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
