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
