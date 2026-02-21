import { Course } from '../course';
import { User } from '../user';

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
    id: string;
    user_id: string;
    target_id: string;
    reason: string;
    description: string;
    status: ReportStatus;
    user?: User;
    course?: Course;
    created_at: string;
    updated_at: string;
}
