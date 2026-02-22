export type MaterialItemType = 'video' | 'reading' | 'quiz' | 'coding' | 'file';

export interface SyllabusMaterial {
    id: string;
    lesson_id: string;
    item_type: MaterialItemType;
    title: string;
    sort_order: number;
    is_required: boolean;
    is_preview: boolean;
    is_completed: boolean;
    duration?: number;
    language?: string;
    file_type?: string;
}

export interface SyllabusLesson {
    id: string;
    module_id: string;
    title: string;
    sort_order: number;
    materials: SyllabusMaterial[];
}

export interface SyllabusModule {
    id: string;
    course_id: string;
    title: string;
    sort_order: number;
    lessons: SyllabusLesson[];
}

export interface CourseSyllabusResponse {
    course_id: string;
    course_title: string;
    modules: SyllabusModule[];
}

export interface CourseProgress {
    percentage: number;
    completed_materials: number;
    total_materials: number;
}

export interface LearnSyllabusResponse extends CourseSyllabusResponse {
    progress: CourseProgress;
    active_material_id: string | null;
}
