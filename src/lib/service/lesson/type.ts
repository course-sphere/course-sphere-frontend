import { z } from 'zod';

// ----------------- Schema ---------------------
export const lessonSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
});
export type LessonFormValues = z.infer<typeof lessonSchema>;

export const materialBaseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    is_required: z.boolean(),
    is_preview: z.boolean(),
});
export type MaterialBaseValues = z.infer<typeof materialBaseSchema>;

export const videoMaterialSchema = materialBaseSchema.extend({
    video_url: z.string().min(1, 'URL is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    description: z.string().optional(),
});
export type VideoMaterialFormValues = z.infer<typeof videoMaterialSchema>;

export const readingMaterialSchema = materialBaseSchema.extend({
    content: z.string().min(10, 'Content is too short'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
});
export type ReadingMaterialFormValues = z.infer<typeof readingMaterialSchema>;

export const fileMaterialSchema = materialBaseSchema.extend({
    file_url: z.string().min(1, 'File URL is required'),
    file_type: z.string().min(1, 'File type is required'),
    file_size: z.number().optional(),
});
export type FileMaterialFormValues = z.infer<typeof fileMaterialSchema>;

export const codingMaterialSchema = materialBaseSchema.extend({
    description: z.string().min(1, 'Description is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    starter_code: z.string().optional(),
    language: z.string().min(1, 'Language is required'), // javascript, python...
    max_score: z.number().min(1, 'Score must be greater than 0'),
    due_days: z.number().min(1, 'Days must be greater than 0'),
});
export type CodingMaterialFormValues = z.infer<typeof codingMaterialSchema>;

export const quizAnswerSchema = z.object({
    id: z.string(),
    content: z.string().min(1, 'Answer cannot be empty'),
    is_correct: z.boolean(),
});

export const quizQuestionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Question is required'),
    question_type: z.enum(['single', 'multiple', 'true_false']),
    score: z.number().min(1),
    explanation: z.string().optional(),
    answers: z.array(quizAnswerSchema).min(2, 'Need at least 2 answers'),
});

export const quizMaterialSchema = materialBaseSchema.extend({
    description: z.string().optional(),
    time_limit_minutes: z.number().min(1, 'Time limit must be at least 1 min'),
    passing_score: z.number().min(1).max(100),
    questions: z.array(quizQuestionSchema).min(1, 'Add at least 1 question'),
});
export type QuizMaterialFormValues = z.infer<typeof quizMaterialSchema>;

//---------------Type and Interface--------------------
export type LessonItemType = 'video' | 'reading' | 'quiz' | 'coding' | 'file';

export interface DraftLessonItem {
    id: string;
    item_type: LessonItemType;
    sort_order: number;

    title: string;
    is_required: boolean;
    is_preview: boolean;

    video_data?: Omit<VideoMaterialFormValues, keyof MaterialBaseValues>;
    reading_data?: Omit<ReadingMaterialFormValues, keyof MaterialBaseValues>;
    file_data?: Omit<FileMaterialFormValues, keyof MaterialBaseValues>;
    coding_data?: Omit<CodingMaterialFormValues, keyof MaterialBaseValues>;
    quiz_data?: Omit<QuizMaterialFormValues, keyof MaterialBaseValues>;
}

export interface DraftLesson {
    id: string;
    title: string;
    sort_order: number;
    items: DraftLessonItem[];
}
export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    sort_order: number;
    status: 'draft' | 'published';
    items?: LessonItem[];
    created_at: string;
    updated_at: string;
}

export interface LessonItem {
    id: string;
    lesson_id: string;
    title: string;
    sort_order: number;
    is_required: boolean;
    is_preview: boolean;
    item_type: LessonItemType;
    item_id: string;
    duration?: number;
    created_at: string;
    updated_at: string;
}

export interface Video {
    id: string;
    video_url: string;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface Reading {
    id: string;
    lesson_id: string;
    content: string;
    duration: number;
    created_at: string;
    updated_at: string;
}
