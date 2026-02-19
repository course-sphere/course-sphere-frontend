export type LessonItemType = 'video' | 'reading' | 'quiz';

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
