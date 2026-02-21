import { User } from '../user';

export interface Assignment {
    id: string;
    lesson_id: string;
    title: string;
    description: string;
    due_date?: string;
    max_score: number;
    created_at: string;
    updated_at: string;
}

export interface AssignmentSubmission {
    id: string;
    assignment_id: string;
    user_id: string;
    content: string;
    submitted_at: string;
    status: 'pending' | 'graded' | 'rejected';
    score?: number;
    feedback?: string;
    user?: User;
}

export interface PeerReview {
    id: string;
    submission_id: string;
    reviewer_id: string;
    score: number;
    feedback: string;
    created_at: string;
    reviewer?: User;
}
