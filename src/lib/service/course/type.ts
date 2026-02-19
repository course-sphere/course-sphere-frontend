import z from 'zod';
// ---------Schema------------------

// emblor tag schema
export const tagSchema = z.object({
    id: z.string(),
    text: z.string(),
});

// create course basic info schema
export const courseBasicInfoSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long'),
    subtitle: z.string().max(200).optional(),
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000),
    category: z.array(tagSchema).min(1, 'Please select at least one topic'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export type CourseBasicInfoFormData = z.infer<typeof courseBasicInfoSchema>;

// create course media schema
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

export const courseMediaSchema = z.object({
    thumbnail_url: z.string().optional(),
    promo_video_url: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine(
            (val) => {
                if (!val) return true;
                return YOUTUBE_REGEX.test(val);
            },
            {
                message: 'Invalid YouTube URL format',
            },
        ),
});

export type CourseMediaFormData = z.infer<typeof courseMediaSchema>;

export const prerequisiteSchema = z.object({
    course_id: z.string(),
    course_title: z.string(),
});

export const categorySchema = z.object({
    category: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
        }),
    ),
});

export const courseMetadataSchema = z.object({
    // Basic Information
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long'),
    subtitle: z.string().max(200).optional(),
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000),
    category: categorySchema,
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    // Media
    thumbnail_url: z.string().optional(),
    promo_video_url: z.string().url().optional().or(z.literal('')),
    // Pricing
    is_free: z.boolean().default(false),
    price: z.number().min(0).default(0),
    discount_price: z.number().min(0).optional(),
    // Prerequisites & Learning Goals
    prerequisites: z.array(prerequisiteSchema).default([]),
    requirements: z.array(z.string()).default([]),
    learning_objectives: z
        .array(z.string())
        .min(3, 'At least 3 learning objectives required'),
    target_audience: z.array(z.string()).default([]),
});

export type CourseMetadataFormData = z.infer<typeof courseMetadataSchema>;

//------------------------
export type CourseLesson = {
    id: string;
    title: string;
    type: 'video' | 'exercise' | 'project';
    duration?: string;
    completed?: boolean;
};

export type CourseModule = {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
};

export type Course = {
    id: string;
    title: string;
    category: string;
    description: string;
    rating: number;
    ratingCount: number;
    instructor: string;
    lastUpdated: string;
    language: string;
    duration: string;
    level: string;
    students: number;
    price: string;
    image: string;
    modules: CourseModule[];
};

export interface CourseCatorgy {
    value: string;
    label: string;
}
