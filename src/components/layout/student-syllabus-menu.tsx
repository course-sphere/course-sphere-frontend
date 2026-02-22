'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Layers,
    PlayCircle,
    FileText,
    Code,
    HelpCircle,
    CheckCircle2,
    Circle,
} from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
    LearnSyllabusResponse,
    MaterialItemType,
} from '@/lib/service/syllabus/type';

const MATERIAL_ICONS: Record<MaterialItemType, React.ElementType> = {
    video: PlayCircle,
    reading: FileText,
    coding: Code,
    quiz: HelpCircle,
    file: FileText,
};

interface StudentSyllabusMenuProps {
    syllabusData: LearnSyllabusResponse;
    onMaterialSelect?: (materialId: string) => void;
}

export function StudentSyllabusMenu({
    syllabusData,
    onMaterialSelect,
}: StudentSyllabusMenuProps) {
    const { modules, progress, active_material_id } = syllabusData;

    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    useEffect(() => {
        if (active_material_id && modules) {
            const activeModule = modules.find((mod) =>
                mod.lessons.some((les) =>
                    les.materials.some((mat) => mat.id === active_material_id),
                ),
            );
            if (activeModule && !expandedModules.includes(activeModule.id)) {
                setExpandedModules((prev) => [...prev, activeModule.id]);
            }
        } else if (modules?.length > 0 && expandedModules.length === 0) {
            setExpandedModules([modules[0].id]);
        }
    }, [active_material_id, modules]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId],
        );
    };

    return (
        <div className="flex w-full flex-col">
            <div className="border-border/50 bg-sidebar sticky top-0 z-10 border-b p-4 group-data-[collapsible=icon]:hidden">
                <h3 className="text-sidebar-foreground mb-3 line-clamp-2 text-sm leading-tight font-bold">
                    {syllabusData.course_title}
                </h3>
                <div className="space-y-1.5">
                    <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                        <span>{progress.percentage}%</span>
                        <span>
                            {progress.completed_materials}/
                            {progress.total_materials}
                        </span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                </div>
            </div>

            <div className="pt-2">
                {modules.map((module) => {
                    const isModuleExpanded = expandedModules.includes(
                        module.id,
                    );

                    return (
                        <SidebarGroup
                            key={module.id}
                            className="border-border/30 border-b py-0 last:border-0"
                        >
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full text-left"
                            >
                                <SidebarGroupLabel className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-auto cursor-pointer gap-2 py-2 transition-colors">
                                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                    <span className="line-clamp-2 text-xs">
                                        {module.title}
                                    </span>
                                </SidebarGroupLabel>
                            </button>

                            {isModuleExpanded && (
                                <SidebarGroupContent className="pb-4">
                                    <SidebarMenu>
                                        {module.lessons.map((lesson) => (
                                            <SidebarMenuItem
                                                key={lesson.id}
                                                className="mt-2"
                                            >
                                                <SidebarMenuButton
                                                    tooltip={lesson.title}
                                                    className="cursor-default font-semibold opacity-70 hover:opacity-100"
                                                >
                                                    <Layers className="h-4 w-4" />
                                                    <span className="truncate">
                                                        {lesson.title}
                                                    </span>
                                                </SidebarMenuButton>

                                                <SidebarMenuSub className="mr-0 pr-0">
                                                    {lesson.materials.map(
                                                        (mat) => {
                                                            const Icon =
                                                                MATERIAL_ICONS[
                                                                    mat
                                                                        .item_type
                                                                ] || FileText;
                                                            const isActive =
                                                                active_material_id ===
                                                                mat.id;

                                                            return (
                                                                <SidebarMenuSubItem
                                                                    key={mat.id}
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        size="sm"
                                                                        className={cn(
                                                                            'cursor-pointer gap-2 py-6',
                                                                            isActive &&
                                                                                'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary border-primary rounded-none border-l-2 font-medium',
                                                                        )}
                                                                        onClick={() =>
                                                                            onMaterialSelect?.(
                                                                                mat.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Icon className="h-3.5 w-3.5 shrink-0" />
                                                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                                                            <span
                                                                                className={cn(
                                                                                    'line-clamp-2 text-xs',
                                                                                    mat.is_completed &&
                                                                                        !isActive
                                                                                        ? 'text-muted-foreground line-through'
                                                                                        : '',
                                                                                )}
                                                                            >
                                                                                {
                                                                                    mat.title
                                                                                }
                                                                            </span>
                                                                            {mat.duration && (
                                                                                <span className="text-muted-foreground/60 text-[10px]">
                                                                                    {
                                                                                        mat.duration
                                                                                    }

                                                                                    m
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="ml-1 shrink-0">
                                                                            {mat.is_completed ? (
                                                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                                            ) : (
                                                                                <Circle
                                                                                    className={cn(
                                                                                        'h-3.5 w-3.5',
                                                                                        isActive
                                                                                            ? 'text-primary'
                                                                                            : 'text-muted-foreground/40',
                                                                                    )}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        },
                                                    )}
                                                </SidebarMenuSub>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            )}
                        </SidebarGroup>
                    );
                })}
            </div>
        </div>
    );
}
