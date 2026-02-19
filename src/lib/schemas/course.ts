import { z } from 'zod';

// Question Answer Schema
export const questionAnswerSchema = z.object({
    id: z.string(),
    content: z.string().min(1, 'Answer content is required'),
    is_correct: z.boolean().default(false),
});

// Question Schema
export const questionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Question title is required'),
    content: z.string().optional(),
    question_type: z.enum(['single', 'multiple', 'true_false']),
    score: z.number().min(1).default(1),
    explanation: z.string().optional(),
    answers: z
        .array(questionAnswerSchema)
        .min(2, 'At least 2 answers required'),
});

// Quiz Schema
export const quizSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Quiz title is required'),
    description: z.string().optional(),
    time_limit_minutes: z.number().min(1).max(180).default(30),
    passing_score: z.number().min(0).max(100).default(70),
    questions: z.array(questionSchema).min(1, 'At least 1 question required'),
});

// Video Schema
export const videoSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Video title is required'),
    video_url: z.string().url('Valid URL required').or(z.string().min(1)),
    duration: z.number().min(0).default(0),
    description: z.string().optional(),
});

// Reading Schema
export const readingSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Reading title is required'),
    content: z.string().min(1, 'Content is required'),
    duration: z.number().min(1).default(5),
});

// Coding Assignment Schema
export const codingAssignmentSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Assignment title is required'),
    description: z.string().min(1, 'Description is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    starter_code: z.string().optional(),
    language: z.string().default('javascript'),
    max_score: z.number().min(1).default(100),
    due_days: z.number().min(1).default(7),
});

// File Resource Schema
export const fileResourceSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'File title is required'),
    file_url: z.string().min(1, 'File URL is required'),
    file_type: z.string(),
    file_size: z.number().optional(),
});

// Lesson Item Schema (polymorphic content)
export const lessonItemSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Item title is required'),
    sort_order: z.number(),
    is_required: z.boolean().default(true),
    is_preview: z.boolean().default(false),
    item_type: z.enum(['video', 'reading', 'quiz', 'coding', 'file']),
    // Content based on type - stored as JSON
    video: videoSchema.optional(),
    reading: readingSchema.optional(),
    quiz: quizSchema.optional(),
    coding: codingAssignmentSchema.optional(),
    file: fileResourceSchema.optional(),
});

// Lesson Schema
export const lessonSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Lesson title is required'),
    description: z.string().optional(),
    sort_order: z.number(),
    items: z.array(lessonItemSchema).default([]),
});

// Module Schema
export const moduleSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Module title is required'),
    description: z.string().optional(),
    sort_order: z.number(),
    lessons: z.array(lessonSchema).min(1, 'At least 1 lesson required'),
});

// Prerequisite Schema
export const prerequisiteSchema = z.object({
    course_id: z.string(),
    course_title: z.string(),
});

// Course Metadata Schema (Phase 1: Steps 1-4, no modules)
export const courseMetadataSchema = z.object({
    // Step 1: Basic Information
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long'),
    subtitle: z.string().max(200).optional(),
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),

    // Step 2: Media
    thumbnail_url: z.string().optional(),
    promo_video_url: z.string().url().optional().or(z.literal('')),

    // Step 3: Pricing
    is_free: z.boolean().default(false),
    price: z.number().min(0).default(0),
    discount_price: z.number().min(0).optional(),

    // Step 4: Prerequisites & Learning Goals
    prerequisites: z.array(prerequisiteSchema).default([]),
    requirements: z.array(z.string()).default([]),
    learning_objectives: z
        .array(z.string())
        .min(3, 'At least 3 learning objectives required'),
    target_audience: z.array(z.string()).default([]),
});

// Course Module Form Schema (Phase 2: Module builder)
export const courseModuleFormSchema = z.object({
    modules: z.array(moduleSchema).min(1, 'At least 1 module required'),
});

// Main Course Schema (full, used for review display)
export const courseFormSchema = z.object({
    // Step 1: Basic Information
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long'),
    subtitle: z.string().max(200).optional(),
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    language: z.string().default('en'),

    // Step 2: Media
    thumbnail_url: z.string().optional(),
    promo_video_url: z.string().url().optional().or(z.literal('')),

    // Step 3: Pricing
    is_free: z.boolean().default(false),
    price: z.number().min(0).default(0),
    discount_price: z.number().min(0).optional(),

    // Step 4: Prerequisites & Learning Goals
    prerequisites: z.array(prerequisiteSchema).default([]),
    requirements: z.array(z.string()).default([]),
    learning_objectives: z
        .array(z.string())
        .min(3, 'At least 3 learning objectives required'),
    target_audience: z.array(z.string()).default([]),

    // Step 5: Curriculum
    modules: z.array(moduleSchema).min(1, 'At least 1 module required'),
});

// Step-specific schemas for validation
export const courseBasicInfoSchema = courseFormSchema.pick({
    title: true,
    subtitle: true,
    description: true,
    category: true,
    subcategory: true,
    level: true,
    language: true,
});

export const courseMediaSchema = courseFormSchema.pick({
    thumbnail_url: true,
    promo_video_url: true,
});

export const coursePricingSchema = courseFormSchema.pick({
    is_free: true,
    price: true,
    discount_price: true,
});

export const courseGoalsSchema = courseFormSchema.pick({
    prerequisites: true,
    requirements: true,
    learning_objectives: true,
    target_audience: true,
});

export const courseCurriculumSchema = courseFormSchema.pick({
    modules: true,
});

// Types
export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Reading = z.infer<typeof readingSchema>;
export type CodingAssignment = z.infer<typeof codingAssignmentSchema>;
export type FileResource = z.infer<typeof fileResourceSchema>;
export type LessonItem = z.infer<typeof lessonItemSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Prerequisite = z.infer<typeof prerequisiteSchema>;
export type CourseFormData = z.infer<typeof courseFormSchema>;
export type CourseMetadataFormData = z.infer<typeof courseMetadataSchema>;
export type CourseModuleFormData = z.infer<typeof courseModuleFormSchema>;

// Categories for the platform
export const COURSE_CATEGORIES = [
    { value: 'programming', label: 'Programming & Development' },
    { value: 'data-science', label: 'Data Science & Analytics' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'web-dev', label: 'Web Development' },
    { value: 'mobile-dev', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'personal-dev', label: 'Personal Development' },
] as const;

export const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
] as const;

// Helper functions
export function generateId(prefix: string = 'item'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyModule(order: number): Module {
    return {
        id: generateId('module'),
        title: `Module ${order}`,
        description: '',
        sort_order: order,
        lessons: [createEmptyLesson(1)],
    };
}

export function createEmptyLesson(order: number): Lesson {
    return {
        id: generateId('lesson'),
        title: `Lesson ${order}`,
        description: '',
        sort_order: order,
        items: [],
    };
}

export function createEmptyLessonItem(
    type: LessonItem['item_type'],
    order: number,
): LessonItem {
    const base = {
        id: generateId('item'),
        title: '',
        sort_order: order,
        is_required: true,
        is_preview: false,
        item_type: type,
    };

    switch (type) {
        case 'video':
            return {
                ...base,
                title: 'New Video',
                video: {
                    id: generateId('video'),
                    title: 'New Video',
                    video_url: '',
                    duration: 0,
                    description: '',
                },
            };
        case 'reading':
            return {
                ...base,
                title: 'New Reading',
                reading: {
                    id: generateId('reading'),
                    title: 'New Reading',
                    content: '',
                    duration: 5,
                },
            };
        case 'quiz':
            return {
                ...base,
                title: 'New Quiz',
                quiz: {
                    id: generateId('quiz'),
                    title: 'New Quiz',
                    description: '',
                    time_limit_minutes: 30,
                    passing_score: 70,
                    questions: [],
                },
            };
        case 'coding':
            return {
                ...base,
                title: 'New Coding Assignment',
                coding: {
                    id: generateId('coding'),
                    title: 'New Coding Assignment',
                    description: '',
                    instructions: '',
                    starter_code: '',
                    language: 'javascript',
                    max_score: 100,
                    due_days: 7,
                },
            };
        case 'file':
            return {
                ...base,
                title: 'New File',
                file: {
                    id: generateId('file'),
                    title: 'New File',
                    file_url: '',
                    file_type: '',
                },
            };
    }
}

export function createEmptyQuestion(order: number): Question {
    return {
        id: generateId('question'),
        title: `Question ${order}`,
        content: '',
        question_type: 'single',
        score: 1,
        explanation: '',
        answers: [
            { id: generateId('answer'), content: 'Option A', is_correct: true },
            {
                id: generateId('answer'),
                content: 'Option B',
                is_correct: false,
            },
        ],
    };
}

export function getDefaultCourseData(): CourseFormData {
    return {
        title: '',
        subtitle: '',
        description: '',
        category: '',
        subcategory: '',
        level: 'beginner',
        language: 'en',
        thumbnail_url: '',
        promo_video_url: '',
        is_free: false,
        price: 0,
        discount_price: undefined,
        prerequisites: [],
        requirements: [],
        learning_objectives: ['', '', ''],
        target_audience: [],
        modules: [createEmptyModule(1)],
    };
}

export function getDefaultMetadataData(): CourseMetadataFormData {
    return {
        title: '',
        subtitle: '',
        description: '',
        category: '',
        subcategory: '',
        level: 'beginner',
        language: 'en',
        thumbnail_url: '',
        promo_video_url: '',
        is_free: false,
        price: 0,
        discount_price: undefined,
        prerequisites: [],
        requirements: [],
        learning_objectives: ['', '', ''],
        target_audience: [],
    };
}

export function getDefaultModuleData(): CourseModuleFormData {
    return {
        modules: [createEmptyModule(1)],
    };
}
