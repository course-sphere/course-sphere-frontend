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
