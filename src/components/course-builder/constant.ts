// This file define hardcode interface and data for create course progress - NOT related to API integration
import { BookOpen, ClipboardCheck, Layers } from 'lucide-react';

// Phase: Create course, build module
export interface Phase {
    id: number;
    title: string;
    description: string;
}

// Step: Course Metadata, Requirement, Thumbnail,..
export interface Step {
    id: number;
    title: string;
    description: string;
}

// Level: Beginner, Advanced,..
export interface CourseLevel {
    value: string;
    label: string;
    description: string;
}

export const COURSE_LEVELS: CourseLevel[] = [
    {
        value: 'beginner',
        label: 'Beginner',
        description: 'No prior knowledge required',
    },
    {
        value: 'intermediate',
        label: 'Intermediate',
        description: 'Some basic knowledge needed',
    },
    {
        value: 'advanced',
        label: 'Advanced',
        description: 'In-depth knowledge required',
    },
];

// 3 phase to create a course
export const PHASES: Phase[] = [
    { id: 1, title: 'Course Info', description: 'Set up your course details' },
    {
        id: 2,
        title: 'Build Modules',
        description: 'Create learning content',
    },
    { id: 3, title: 'Review', description: 'Review & submit' },
];

// Sub-steps within Phase 1: Course Metadata
export const METADATA_STEPS: Step[] = [
    { id: 1, title: 'Basic Info', description: 'Course details' },
    { id: 2, title: 'Media', description: 'Thumbnail & video' },
    { id: 3, title: 'Pricing', description: 'Set your price' },
    { id: 4, title: 'Goals', description: 'Learning objectives' },
];

export const PHASE_ICONS = [BookOpen, Layers, ClipboardCheck];
