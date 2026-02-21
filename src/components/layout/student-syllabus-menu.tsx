'use client';

import {
    BookOpen,
    Layers,
    PlayCircle,
    FileText,
    Code,
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

// ─── Mock syllabus data ─────────────────────────────────────────────
interface MaterialItem {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'coding';
    completed: boolean;
}

interface LessonItem {
    id: string;
    title: string;
    materials: MaterialItem[];
}

interface ModuleItem {
    id: string;
    title: string;
    lessons: LessonItem[];
}

const MOCK_SYLLABUS: ModuleItem[] = [
    {
        id: 'mod-1',
        title: 'Getting Started',
        lessons: [
            {
                id: 'les-1',
                title: 'Welcome & Setup',
                materials: [
                    {
                        id: 'mat-1',
                        title: 'Intro Video',
                        type: 'video',
                        completed: true,
                    },
                    {
                        id: 'mat-2',
                        title: 'Setup Guide',
                        type: 'reading',
                        completed: true,
                    },
                ],
            },
            {
                id: 'les-2',
                title: 'First Steps',
                materials: [
                    {
                        id: 'mat-3',
                        title: 'Hello World',
                        type: 'coding',
                        completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 'mod-2',
        title: 'Core Concepts',
        lessons: [
            {
                id: 'les-3',
                title: 'State Management',
                materials: [
                    {
                        id: 'mat-4',
                        title: 'Deep Dive',
                        type: 'video',
                        completed: false,
                    },
                    {
                        id: 'mat-5',
                        title: 'Practice Exercise',
                        type: 'coding',
                        completed: false,
                    },
                ],
            },
        ],
    },
];

// ─── Icon Map ───────────────────────────────────────────────────────
const MATERIAL_ICONS = {
    video: PlayCircle,
    reading: FileText,
    coding: Code,
} as const;

// ─── Component ──────────────────────────────────────────────────────
export function StudentSyllabusMenu() {
    return (
        <>
            {MOCK_SYLLABUS.map((module) => (
                <SidebarGroup key={module.id}>
                    <SidebarGroupLabel className="gap-2">
                        <BookOpen className="h-3.5 w-3.5" />
                        {module.title}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {module.lessons.map((lesson) => (
                                <SidebarMenuItem key={lesson.id}>
                                    <SidebarMenuButton tooltip={lesson.title}>
                                        <Layers className="h-4 w-4" />
                                        <span>{lesson.title}</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {lesson.materials.map((mat) => {
                                            const Icon =
                                                MATERIAL_ICONS[mat.type];
                                            return (
                                                <SidebarMenuSubItem
                                                    key={mat.id}
                                                >
                                                    <SidebarMenuSubButton
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <Icon className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="flex-1 truncate">
                                                            {mat.title}
                                                        </span>
                                                        {mat.completed ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                                                        ) : (
                                                            <Circle className="text-muted-foreground/40 h-3.5 w-3.5 shrink-0" />
                                                        )}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}
