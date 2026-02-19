'use client';

import { useState } from 'react';
import { ChevronDown, Play, Code, Zap, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'exercise' | 'project';
    duration?: string;
    completed?: boolean;
}

interface Module {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface DetailCurriculumProps {
    type: 'course' | 'learning-path';
    modules: Module[];
    totalLessons: number;
    totalHours: number;
}

const iconMap = {
    video: Play,
    exercise: Code,
    project: Zap,
};

export function DetailCurriculum({
    type,
    modules,
    totalLessons,
    totalHours,
}: DetailCurriculumProps) {
    const [expandedModule, setExpandedModule] = useState<string | null>(
        modules.length > 0 ? modules[0].id : null,
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                    {type === 'course'
                        ? 'Course Curriculum'
                        : 'Path Curriculum'}
                </h2>
                <div className="flex gap-6">
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Total Modules
                        </p>
                        <p className="text-foreground font-semibold">
                            {modules.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Total Lessons
                        </p>
                        <p className="text-foreground font-semibold">
                            {totalLessons}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Total Hours
                        </p>
                        <p className="text-foreground font-semibold">
                            {totalHours}+
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {modules.map((module) => {
                    const Icon = iconMap[module.lessons[0]?.type || 'video'];
                    const isExpanded = expandedModule === module.id;
                    const completedLessons = module.lessons.filter(
                        (l) => l.completed,
                    ).length;

                    return (
                        <Card
                            key={module.id}
                            className="border-border hover:border-accent/50 overflow-hidden border transition-colors"
                        >
                            <button
                                onClick={() =>
                                    setExpandedModule(
                                        isExpanded ? null : module.id,
                                    )
                                }
                                className="w-full"
                            >
                                <div className="hover:bg-muted/50 flex items-center justify-between p-6 transition-colors">
                                    <div className="flex-1 text-left">
                                        <div className="mb-2 flex items-center gap-3">
                                            <div className="bg-primary/10 rounded-lg p-2">
                                                <Icon className="text-primary h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-foreground font-semibold">
                                                    {module.title}
                                                </h3>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex items-center gap-4">
                                        <Badge variant="secondary">
                                            {module.lessons.length} lessons
                                        </Badge>
                                        {completedLessons > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="bg-transparent"
                                            >
                                                {completedLessons}/
                                                {module.lessons.length} done
                                            </Badge>
                                        )}
                                        <ChevronDown
                                            className={`text-muted-foreground h-5 w-5 transition-transform ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-border bg-muted/30 border-t px-6 py-4">
                                    <div className="space-y-3">
                                        {module.lessons.map((lesson) => {
                                            const LessonIcon =
                                                iconMap[
                                                    lesson.type as keyof typeof iconMap
                                                ];
                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className="hover:bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors"
                                                >
                                                    <div className="flex flex-1 items-center gap-2">
                                                        {lesson.completed ? (
                                                            <CheckCircle className="text-primary h-5 w-5 shrink-0" />
                                                        ) : (
                                                            <LessonIcon className="text-muted-foreground h-5 w-5 shrink-0" />
                                                        )}
                                                        <span
                                                            className={
                                                                lesson.completed
                                                                    ? 'text-muted-foreground text-sm line-through'
                                                                    : 'text-foreground text-sm'
                                                            }
                                                        >
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {lesson.duration && (
                                                        <span className="text-muted-foreground text-xs">
                                                            {lesson.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
