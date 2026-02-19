// User & Auth Types
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

// Wallet & Transaction Types
export type TransactionType =
    | 'deposit'
    | 'withdrawal'
    | 'purchase'
    | 'earning'
    | 'refund';
export type TransactionDirection = 'in' | 'out';
export type WalletStatus = 'active' | 'frozen' | 'pending';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    status: WalletStatus;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    wallet_id: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: number;
    description?: string;
    created_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    amount: number;
    txn_id: string;
    status: PaymentStatus;
    pay_at: string;
    created_at: string;
}

// Course Types
export type CourseStatus =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'published';
export type LessonItemType = 'video' | 'reading' | 'quiz';

export interface Course {
    id: string;
    teacher_id: string;
    teacher_name?: string;
    title: string;
    description?: string;
    price: number;
    thumbnail_url?: string;
    is_published: boolean;
    status: CourseStatus;
    created_at: string;
    updated_at: string;
    students_count?: number;
    rating?: number;
    modules?: Module[];
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    sort_order: number;
    status: 'draft' | 'published';
    lessons?: Lesson[];
    created_at: string;
    updated_at: string;
}

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

export interface Video {
    id: string;
    video_url: string;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface Reading {
    id: string;
    lesson_id: string;
    content: string;
    duration: number;
    created_at: string;
    updated_at: string;
}

// Quiz Types
export type QuestionType = 'single' | 'multiple' | 'true_false';

export interface Quiz {
    id: string;
    title: string;
    time_limit_minutes: number;
    passing_score: number;
    questions?: Question[];
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: string;
    quiz_id: string;
    title: string;
    content: string;
    question_type: QuestionType;
    score: number;
    explanation?: string;
    answers?: QuestionAnswer[];
    created_at: string;
}

export interface QuestionAnswer {
    id: string;
    question_id: string;
    content: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
}

// Enrollment & Progress
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

// Bundle & Roadmap
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

// Comments & Replies
export interface Comment {
    id: string;
    user_id: string;
    course_id: string;
    content: string;
    user?: User;
    replies?: Reply[];
    created_at: string;
    updated_at: string;
}

export interface Reply {
    id: string;
    comment_id: string;
    user_reply_id: string;
    content: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

// Report Types
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

// Assignment & Peer Grading
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

// Withdrawal Request
export type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WithdrawRequest {
    id: string;
    user_id: string;
    amount: number;
    status: WithdrawStatus;
    bank_info?: string;
    note?: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

// Dashboard Stats
export interface AdminStats {
    total_users: number;
    total_courses: number;
    total_revenue: number;
    pending_approvals: number;
    pending_reports: number;
    pending_withdrawals: number;
}

export interface TeacherStats {
    total_courses: number;
    total_students: number;
    total_earnings: number;
    pending_courses: number;
    average_rating: number;
}

export interface StudentStats {
    enrolled_courses: number;
    completed_courses: number;
    in_progress_courses: number;
    total_spent: number;
}
