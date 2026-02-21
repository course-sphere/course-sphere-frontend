import { Course } from '../course';

export interface Bundle {
    id: string;
    title: string;
    price: number;
    thumbnail_url?: string;
    name: string;
    is_published: boolean;
    status: 'draft' | 'published';
    courses?: Course[];
    created_at: string;
    updated_at: string;
}
