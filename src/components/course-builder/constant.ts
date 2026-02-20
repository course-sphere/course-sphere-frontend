// This file define hardcode interface and data for create course progress - NOT related to API integration
import { BookOpen, ClipboardCheck, Layers } from 'lucide-react';

// Phase: Create course, build module
export interface Phase {
    id: number;
    title: string;
    description: string;
}

// 3 phase to create a course, 1 phase have 3 steps
export const PHASES: Phase[] = [
    { id: 1, title: 'Course Info', description: 'Set up your course details' },
    {
        id: 2,
        title: 'Build Modules',
        description: 'Create learning content',
    },
    { id: 3, title: 'Review', description: 'Review & submit' },
];

export const PHASE_ICONS = [BookOpen, Layers, ClipboardCheck];

// Step: Course Metadata, Requirement, Thumbnail,..
export interface Step {
    id: number;
    title: string;
    description: string;
}

// Sub-steps within Phase 1: Course Metadata
export const METADATA_STEPS: Step[] = [
    { id: 1, title: 'Basic Info', description: 'Course details' },
    { id: 2, title: 'Media', description: 'Thumbnail & video' },
    { id: 3, title: 'Pricing', description: 'Set your price' },
    { id: 4, title: 'Goals', description: 'Learning objectives' },
];

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

// sample pricing for step 3 in phase 1 (metadata)
export const PRICING_TIERS = [
    { value: 9.99, label: '$9.99', description: 'Entry level' },
    { value: 19.99, label: '$19.99', description: 'Standard' },
    { value: 49.99, label: '$49.99', description: 'Premium' },
    { value: 89.99, label: '$89.99', description: 'Professional' },
    { value: 199.99, label: '$199.99', description: 'Expert' },
];
