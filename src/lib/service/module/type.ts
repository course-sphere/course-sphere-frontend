import { z } from 'zod';
import { Lesson } from '../lesson';

// ------------------Schema-----------------
export const moduleSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().optional(),
});
export type ModuleFormValues = z.infer<typeof moduleSchema>;

// ---------------Type------------------------
export interface Module {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    sort_order: number;
    status: 'draft' | 'published';
    lessons?: Lesson[];
    created_at: string;
    updated_at: string;
}
