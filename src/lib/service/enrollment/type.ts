import { Course } from '../course';

export interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    current_progress_percent: number;
    is_completed: boolean;
    completed_at?: string;
    course?: Course;
}
