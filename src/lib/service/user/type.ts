export type Role = 'student' | 'teacher' | 'admin';

export interface User {
    id: string;
    email: string;
    phone?: string;
    name: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    birthday?: string;
    role: Role;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    avatar_url?: string;
}
