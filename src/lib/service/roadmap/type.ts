import { Course } from '../course';

export interface Roadmap {
    id: string;
    title: string;
    thumbnail_url?: string;
    name: string;
    is_published: boolean;
    status: 'draft' | 'published';
    courses?: Course[];
    created_at: string;
    updated_at: string;
}
//------------
export interface CreateRoadmapPayload {
    title: string;
    description: string;
}

export interface UpdateRoadmapPayload {
    title?: string;
    description?: string;
    position?: number;
}

export interface RoadmapCoursePayload {
    course_id: string;
}

export interface MoveRoadmapCoursePayload {
    prev_id: string;
    next_id: string;
}
