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
    current_id: string;
    prev_id?: string | null;
    next_id?: string | null;
}

export interface RoadmapDetailRaw {
    author_id: string;
    position: number;
    title: string;
    description: string;
    courses: string[];
}

export interface RoadmapAggregated {
    id: string;
    author_id: string;
    position: number;
    title: string;
    description: string;
    courseIds: string[];
    courseCount: number;
}
