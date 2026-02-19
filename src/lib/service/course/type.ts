import z from 'zod';
// ---------Schema------------------

// emblor tag schema
export const tagSchema = z.object({
    id: z.string(),
    text: z.string(),
});

// create course basic info schema (sub step in step 1)
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

// create course media schema (sub step in step 1)
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

//create course pricing Schema (sub step in step 1)
export const coursePricingSchema = z
    .object({
        is_free: z.boolean().default(false),
        price: z.coerce.number().min(0).default(0),
        discount_price: z.coerce.number().min(0).optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
        if (!data.is_free && data.price < 9.99) {
            ctx.addIssue({
                code: 'custom',
                message: 'Minimum price for a paid course is $9.99',
                path: ['price'],
            });
        }
        // discount must be less than original price
        if (
            !data.is_free &&
            typeof data.discount_price === 'number' &&
            data.discount_price >= data.price
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'Discount price must be strictly less than the original price',
                path: ['discount_price'],
            });
        }
    });

export type CoursePricingFormData = z.infer<typeof coursePricingSchema>;

export const prerequisiteSchema = z.object({
    course_id: z.string(),
    course_title: z.string(),
});

// schema for goal & prerequisites (sub step in step 1)
export const courseGoalsSchema = z.object({
    prerequisites: z.array(prerequisiteSchema).default([]),

    requirements: z
        .array(z.string().min(1, 'Requirement cannot be empty'))
        .default([]),

    learning_objectives: z
        .array(z.string().min(1, 'Objective cannot be empty'))
        .min(3, 'At least 3 learning objectives required'),

    target_audience: z
        .array(z.string().min(1, 'Target audience cannot be empty'))
        .default([]),
});

export type CourseGoalsFormData = z.infer<typeof courseGoalsSchema>;

// schema for step 1: Course Metadata (Send to BE)
export const courseMetadataSchema = z
    .object({
        ...courseBasicInfoSchema.shape,
        ...courseMediaSchema.shape,
        ...courseGoalsSchema.shape,
        is_free: z.boolean().default(false),
        price: z.coerce.number().min(0).default(0),
        discount_price: z.coerce.number().min(0).optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
        if (!data.is_free && data.price < 9.99) {
            ctx.addIssue({
                code: 'custom',
                message: 'Minimum price is $9.99',
                path: ['price'],
            });
        }
        if (
            !data.is_free &&
            typeof data.discount_price === 'number' &&
            data.discount_price >= data.price
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Discount must be less than price',
                path: ['discount_price'],
            });
        }
    });

export type CourseMetadataFormData = z.infer<typeof courseMetadataSchema>;

export function getDefaultMetadataData(): CourseMetadataFormData {
    return {
        title: '',
        subtitle: '',
        description: '',
        category: [],
        level: 'beginner',

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
