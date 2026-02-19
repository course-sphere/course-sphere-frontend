import type {
    User,
    Course,
    Module,
    Lesson,
    LessonItem,
    Enrollment,
    Wallet,
    Transaction,
    Report,
    WithdrawRequest,
    Comment,
    Assignment,
    AssignmentSubmission,
    PeerReview,
    AdminStats,
    TeacherStats,
    StudentStats,
    Quiz,
    Question,
} from './types';

// Fake Users
export const fakeUsers: User[] = [
    {
        id: 'user-1',
        email: 'student@example.com',
        name: 'Alex Johnson',
        role: 'student',
        is_active: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        avatar_url: '/placeholder.svg?height=100&width=100',
    },
    {
        id: 'user-2',
        email: 'teacher@example.com',
        name: 'Dr. Sarah Chen',
        role: 'teacher',
        is_active: true,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
        avatar_url: '/placeholder.svg?height=100&width=100',
    },
    {
        id: 'user-3',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        is_active: true,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
        avatar_url: '/placeholder.svg?height=100&width=100',
    },
    {
        id: 'user-4',
        email: 'mike@example.com',
        name: 'Mike Wilson',
        role: 'teacher',
        is_active: true,
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z',
        avatar_url: '/placeholder.svg?height=100&width=100',
    },
    {
        id: 'user-5',
        email: 'emma@example.com',
        name: 'Emma Davis',
        role: 'student',
        is_active: true,
        created_at: '2024-02-15T10:00:00Z',
        updated_at: '2024-02-15T10:00:00Z',
        avatar_url: '/placeholder.svg?height=100&width=100',
    },
];

// Fake Lesson Items
const fakeLessonItems: LessonItem[] = [
    {
        id: 'item-1',
        lesson_id: 'lesson-1',
        title: 'Introduction Video',
        sort_order: 1,
        is_required: true,
        is_preview: true,
        item_type: 'video',
        item_id: 'video-1',
        duration: 15,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'item-2',
        lesson_id: 'lesson-1',
        title: 'Getting Started Guide',
        sort_order: 2,
        is_required: true,
        is_preview: false,
        item_type: 'reading',
        item_id: 'reading-1',
        duration: 10,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'item-3',
        lesson_id: 'lesson-1',
        title: 'Knowledge Check',
        sort_order: 3,
        is_required: true,
        is_preview: false,
        item_type: 'quiz',
        item_id: 'quiz-1',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
];

// Fake Lessons
const fakeLessons: Lesson[] = [
    {
        id: 'lesson-1',
        module_id: 'module-1',
        title: 'Getting Started with React',
        sort_order: 1,
        status: 'published',
        items: fakeLessonItems,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'lesson-2',
        module_id: 'module-1',
        title: 'JSX Fundamentals',
        sort_order: 2,
        status: 'published',
        items: [],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'lesson-3',
        module_id: 'module-1',
        title: 'Components and Props',
        sort_order: 3,
        status: 'published',
        items: [],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
];

// Fake Modules
const fakeModules: Module[] = [
    {
        id: 'module-1',
        course_id: 'course-1',
        title: 'React Basics',
        sort_order: 1,
        status: 'published',
        lessons: fakeLessons,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'module-2',
        course_id: 'course-1',
        title: 'State Management',
        sort_order: 2,
        status: 'published',
        lessons: [
            {
                id: 'lesson-4',
                module_id: 'module-2',
                title: 'useState Hook',
                sort_order: 1,
                status: 'published',
                items: [],
                created_at: '2024-01-20T10:00:00Z',
                updated_at: '2024-01-20T10:00:00Z',
            },
            {
                id: 'lesson-5',
                module_id: 'module-2',
                title: 'useEffect Hook',
                sort_order: 2,
                status: 'published',
                items: [],
                created_at: '2024-01-20T10:00:00Z',
                updated_at: '2024-01-20T10:00:00Z',
            },
        ],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'module-3',
        course_id: 'course-1',
        title: 'Advanced Patterns',
        sort_order: 3,
        status: 'published',
        lessons: [
            {
                id: 'lesson-6',
                module_id: 'module-3',
                title: 'Custom Hooks',
                sort_order: 1,
                status: 'published',
                items: [],
                created_at: '2024-01-20T10:00:00Z',
                updated_at: '2024-01-20T10:00:00Z',
            },
        ],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
];

// Fake Courses
export const fakeCourses: Course[] = [
    {
        id: 'course-1',
        teacher_id: 'user-2',
        teacher_name: 'Dr. Sarah Chen',
        title: 'Complete React Development',
        description:
            'Master React from basics to advanced patterns. Build real-world applications with modern React practices including hooks, context, and more.',
        price: 49.99,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: true,
        status: 'published',
        students_count: 1250,
        rating: 4.8,
        modules: fakeModules,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: 'course-2',
        teacher_id: 'user-2',
        teacher_name: 'Dr. Sarah Chen',
        title: 'Python for Data Science',
        description:
            'Learn Python programming for data analysis, visualization, and machine learning. Perfect for beginners and intermediate programmers.',
        price: 59.99,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: true,
        status: 'published',
        students_count: 980,
        rating: 4.7,
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z',
    },
    {
        id: 'course-3',
        teacher_id: 'user-4',
        teacher_name: 'Mike Wilson',
        title: 'UI/UX Design Fundamentals',
        description:
            'Master the principles of user interface and user experience design. Learn to create beautiful, functional designs that users love.',
        price: 0,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: true,
        status: 'published',
        students_count: 2100,
        rating: 4.9,
        created_at: '2024-02-15T10:00:00Z',
        updated_at: '2024-02-15T10:00:00Z',
    },
    {
        id: 'course-4',
        teacher_id: 'user-4',
        teacher_name: 'Mike Wilson',
        title: 'Advanced JavaScript Patterns',
        description:
            'Deep dive into advanced JavaScript concepts including closures, prototypes, async patterns, and design patterns.',
        price: 79.99,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: false,
        status: 'pending',
        students_count: 0,
        rating: 0,
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z',
    },
    {
        id: 'course-5',
        teacher_id: 'user-2',
        teacher_name: 'Dr. Sarah Chen',
        title: 'Machine Learning Basics',
        description:
            'Introduction to machine learning algorithms and their applications. Build your first ML models with hands-on projects.',
        price: 89.99,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: false,
        status: 'rejected',
        students_count: 0,
        rating: 0,
        created_at: '2024-03-10T10:00:00Z',
        updated_at: '2024-03-10T10:00:00Z',
    },
    {
        id: 'course-6',
        teacher_id: 'user-4',
        teacher_name: 'Mike Wilson',
        title: 'Node.js Backend Development',
        description:
            'Build scalable backend applications with Node.js, Express, and MongoDB. Learn RESTful API design and authentication.',
        price: 69.99,
        thumbnail_url: '/placeholder.svg?height=200&width=300',
        is_published: false,
        status: 'draft',
        students_count: 0,
        rating: 0,
        created_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
    },
];

// Fake Enrollments
export const fakeEnrollments: Enrollment[] = [
    {
        id: 'enroll-1',
        user_id: 'user-1',
        course_id: 'course-1',
        enrolled_at: '2024-02-01T10:00:00Z',
        current_progress_percent: 65,
        is_completed: false,
        course: fakeCourses[0],
    },
    {
        id: 'enroll-2',
        user_id: 'user-1',
        course_id: 'course-3',
        enrolled_at: '2024-02-20T10:00:00Z',
        current_progress_percent: 100,
        is_completed: true,
        completed_at: '2024-03-15T10:00:00Z',
        course: fakeCourses[2],
    },
    {
        id: 'enroll-3',
        user_id: 'user-5',
        course_id: 'course-1',
        enrolled_at: '2024-03-01T10:00:00Z',
        current_progress_percent: 30,
        is_completed: false,
        course: fakeCourses[0],
    },
];

// Fake Wallets
export const fakeWallets: Wallet[] = [
    {
        id: 'wallet-1',
        user_id: 'user-1',
        balance: 150.0,
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
    },
    {
        id: 'wallet-2',
        user_id: 'user-2',
        balance: 2450.0,
        status: 'active',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
    },
    {
        id: 'wallet-3',
        user_id: 'user-4',
        balance: 1890.0,
        status: 'active',
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
    },
];

// Fake Transactions
export const fakeTransactions: Transaction[] = [
    {
        id: 'txn-1',
        wallet_id: 'wallet-1',
        type: 'deposit',
        direction: 'in',
        amount: 200.0,
        description: 'Bank transfer deposit',
        created_at: '2024-03-01T10:00:00Z',
    },
    {
        id: 'txn-2',
        wallet_id: 'wallet-1',
        type: 'purchase',
        direction: 'out',
        amount: 49.99,
        description: 'Purchased: Complete React Development',
        created_at: '2024-03-02T10:00:00Z',
    },
    {
        id: 'txn-3',
        wallet_id: 'wallet-2',
        type: 'earning',
        direction: 'in',
        amount: 44.99,
        description: 'Course sale: Complete React Development',
        created_at: '2024-03-02T10:00:00Z',
    },
    {
        id: 'txn-4',
        wallet_id: 'wallet-2',
        type: 'withdrawal',
        direction: 'out',
        amount: 500.0,
        description: 'Withdrawal to bank account',
        created_at: '2024-03-15T10:00:00Z',
    },
    {
        id: 'txn-5',
        wallet_id: 'wallet-1',
        type: 'refund',
        direction: 'in',
        amount: 59.99,
        description: 'Refund: Python for Data Science',
        created_at: '2024-03-18T10:00:00Z',
    },
];

// Fake Reports
export const fakeReports: Report[] = [
    {
        id: 'report-1',
        user_id: 'user-1',
        target_id: 'course-2',
        reason: 'Misleading content',
        description:
            'The course description promises advanced topics but only covers basics. I feel misled by the marketing.',
        status: 'pending',
        user: fakeUsers[0],
        course: fakeCourses[1],
        created_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
    },
    {
        id: 'report-2',
        user_id: 'user-5',
        target_id: 'course-1',
        reason: 'Video quality issue',
        description:
            'Several videos in Module 2 have poor audio quality making it hard to understand the instructor.',
        status: 'approved',
        user: fakeUsers[4],
        course: fakeCourses[0],
        created_at: '2024-03-10T10:00:00Z',
        updated_at: '2024-03-12T10:00:00Z',
    },
    {
        id: 'report-3',
        user_id: 'user-1',
        target_id: 'course-3',
        reason: 'Outdated content',
        description:
            'The design tools mentioned in the course are outdated. Need to update to current versions.',
        status: 'rejected',
        user: fakeUsers[0],
        course: fakeCourses[2],
        created_at: '2024-03-05T10:00:00Z',
        updated_at: '2024-03-07T10:00:00Z',
    },
];

// Fake Withdrawal Requests
export const fakeWithdrawRequests: WithdrawRequest[] = [
    {
        id: 'withdraw-1',
        user_id: 'user-2',
        amount: 500.0,
        status: 'completed',
        bank_info: 'Bank ABC - ****1234',
        user: fakeUsers[1],
        created_at: '2024-03-10T10:00:00Z',
        updated_at: '2024-03-12T10:00:00Z',
    },
    {
        id: 'withdraw-2',
        user_id: 'user-4',
        amount: 300.0,
        status: 'pending',
        bank_info: 'Bank XYZ - ****5678',
        user: fakeUsers[3],
        created_at: '2024-03-18T10:00:00Z',
        updated_at: '2024-03-18T10:00:00Z',
    },
    {
        id: 'withdraw-3',
        user_id: 'user-2',
        amount: 1000.0,
        status: 'approved',
        bank_info: 'Bank ABC - ****1234',
        note: 'Processing within 24 hours',
        user: fakeUsers[1],
        created_at: '2024-03-19T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
    },
];

// Fake Comments
export const fakeComments: Comment[] = [
    {
        id: 'comment-1',
        user_id: 'user-1',
        course_id: 'course-1',
        content:
            'This course is amazing! The instructor explains complex concepts in a very clear way.',
        user: fakeUsers[0],
        replies: [
            {
                id: 'reply-1',
                comment_id: 'comment-1',
                user_reply_id: 'user-2',
                content:
                    "Thank you so much! I'm glad you're enjoying the course.",
                user: fakeUsers[1],
                created_at: '2024-03-16T12:00:00Z',
                updated_at: '2024-03-16T12:00:00Z',
            },
        ],
        created_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
    },
    {
        id: 'comment-2',
        user_id: 'user-5',
        course_id: 'course-1',
        content:
            "Can you add more examples for the hooks section? I'm having trouble understanding useEffect.",
        user: fakeUsers[4],
        replies: [],
        created_at: '2024-03-18T10:00:00Z',
        updated_at: '2024-03-18T10:00:00Z',
    },
];

// Fake Assignments
export const fakeAssignments: Assignment[] = [
    {
        id: 'assignment-1',
        lesson_id: 'lesson-3',
        title: 'Build a Todo App Component',
        description:
            'Create a fully functional todo list component using React hooks. Must include add, delete, and toggle complete functionality.',
        due_date: '2024-04-01T23:59:59Z',
        max_score: 100,
        created_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
    },
    {
        id: 'assignment-2',
        lesson_id: 'lesson-5',
        title: 'State Management Challenge',
        description:
            'Implement a shopping cart using useReducer hook. Handle add to cart, remove from cart, and update quantity.',
        due_date: '2024-04-10T23:59:59Z',
        max_score: 100,
        created_at: '2024-03-20T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
    },
];

// Fake Assignment Submissions
export const fakeSubmissions: AssignmentSubmission[] = [
    {
        id: 'submission-1',
        assignment_id: 'assignment-1',
        user_id: 'user-1',
        content: 'https://github.com/alexjohnson/todo-app',
        submitted_at: '2024-03-28T15:00:00Z',
        status: 'graded',
        score: 85,
        feedback:
            'Good implementation! Consider adding error handling for edge cases.',
        user: fakeUsers[0],
    },
    {
        id: 'submission-2',
        assignment_id: 'assignment-1',
        user_id: 'user-5',
        content: 'https://github.com/emmadavis/react-todo',
        submitted_at: '2024-03-30T10:00:00Z',
        status: 'pending',
        user: fakeUsers[4],
    },
];

// Fake Peer Reviews
export const fakePeerReviews: PeerReview[] = [
    {
        id: 'review-1',
        submission_id: 'submission-1',
        reviewer_id: 'user-5',
        score: 85,
        feedback:
            'Clean code structure and good use of hooks. Could improve UI styling.',
        created_at: '2024-03-29T10:00:00Z',
        reviewer: fakeUsers[4],
    },
];

// Fake Quizzes
export const fakeQuizzes: Quiz[] = [
    {
        id: 'quiz-1',
        title: 'React Basics Quiz',
        time_limit_minutes: 15,
        passing_score: 70,
        questions: [
            {
                id: 'q-1',
                quiz_id: 'quiz-1',
                title: 'What is JSX?',
                content:
                    'What does JSX stand for and what is its purpose in React?',
                question_type: 'single',
                score: 10,
                explanation:
                    'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
                answers: [
                    {
                        id: 'a-1',
                        question_id: 'q-1',
                        content:
                            'JavaScript XML - A syntax extension for React',
                        is_correct: true,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-2',
                        question_id: 'q-1',
                        content: 'Java Syntax Extension',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-3',
                        question_id: 'q-1',
                        content: 'JavaScript Extra',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-4',
                        question_id: 'q-1',
                        content: 'JSON XML',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                ],
                created_at: '2024-01-20T10:00:00Z',
            },
            {
                id: 'q-2',
                quiz_id: 'quiz-1',
                title: 'React Components',
                content:
                    'Which of the following are valid ways to create a React component?',
                question_type: 'multiple',
                score: 15,
                answers: [
                    {
                        id: 'a-5',
                        question_id: 'q-2',
                        content: 'Function components',
                        is_correct: true,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-6',
                        question_id: 'q-2',
                        content: 'Class components',
                        is_correct: true,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-7',
                        question_id: 'q-2',
                        content: 'HTML components',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-8',
                        question_id: 'q-2',
                        content: 'CSS components',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                ],
                created_at: '2024-01-20T10:00:00Z',
            },
            {
                id: 'q-3',
                quiz_id: 'quiz-1',
                title: 'Virtual DOM',
                content: 'React uses a Virtual DOM for better performance.',
                question_type: 'true_false',
                score: 10,
                explanation:
                    'React maintains a virtual representation of the DOM to minimize direct DOM manipulations.',
                answers: [
                    {
                        id: 'a-9',
                        question_id: 'q-3',
                        content: 'True',
                        is_correct: true,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                    {
                        id: 'a-10',
                        question_id: 'q-3',
                        content: 'False',
                        is_correct: false,
                        created_at: '2024-01-20T10:00:00Z',
                        updated_at: '2024-01-20T10:00:00Z',
                    },
                ],
                created_at: '2024-01-20T10:00:00Z',
            },
        ],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
];

// Dashboard Stats
export const fakeAdminStats: AdminStats = {
    total_users: 15420,
    total_courses: 156,
    total_revenue: 245680.0,
    pending_approvals: 8,
    pending_reports: 3,
    pending_withdrawals: 5,
};

export const fakeTeacherStats: TeacherStats = {
    total_courses: 4,
    total_students: 2230,
    total_earnings: 12450.0,
    pending_courses: 1,
    average_rating: 4.75,
};

export const fakeStudentStats: StudentStats = {
    enrolled_courses: 3,
    completed_courses: 1,
    in_progress_courses: 2,
    total_spent: 109.98,
};

// Get current user based on role (for demo purposes)
export function getCurrentUser(role: 'student' | 'teacher' | 'admin'): User {
    return fakeUsers.find((u) => u.role === role) || fakeUsers[0];
}

// Get user's wallet
export function getUserWallet(userId: string): Wallet | undefined {
    return fakeWallets.find((w) => w.user_id === userId);
}

// Get user's transactions
export function getUserTransactions(walletId: string): Transaction[] {
    return fakeTransactions.filter((t) => t.wallet_id === walletId);
}

// Get user's enrollments
export function getUserEnrollments(userId: string): Enrollment[] {
    return fakeEnrollments.filter((e) => e.user_id === userId);
}

// Get teacher's courses
export function getTeacherCourses(teacherId: string): Course[] {
    return fakeCourses.filter((c) => c.teacher_id === teacherId);
}

// Get pending courses for admin
export function getPendingCourses(): Course[] {
    return fakeCourses.filter((c) => c.status === 'pending');
}

// Student Wallet data for wallet page
export const fakeWallet = {
    balance: 2500000,
    totalDeposited: 5000000,
    totalSpent: 2500000,
};

// Teacher Wallet data
export const fakeTeacherWallet = {
    availableBalance: 45000000,
    pendingBalance: 12500000,
    totalEarnings: 125000000,
    totalWithdrawn: 67500000,
};

// Enhanced transactions with status
export const fakeTransactionsEnhanced = [
    {
        id: 'txn-1',
        type: 'deposit' as const,
        direction: 'in' as const,
        amount: 2000000,
        description: 'Bank transfer - Vietcombank',
        status: 'completed',
        createdAt: '2026-01-15T10:00:00Z',
    },
    {
        id: 'txn-2',
        type: 'purchase' as const,
        direction: 'out' as const,
        amount: 499000,
        description: 'Complete React Development',
        status: 'completed',
        createdAt: '2026-01-16T14:30:00Z',
    },
    {
        id: 'txn-3',
        type: 'purchase' as const,
        direction: 'out' as const,
        amount: 599000,
        description: 'Python for Data Science',
        status: 'completed',
        createdAt: '2026-01-18T09:15:00Z',
    },
    {
        id: 'txn-4',
        type: 'deposit' as const,
        direction: 'in' as const,
        amount: 1000000,
        description: 'MoMo Wallet',
        status: 'completed',
        createdAt: '2026-01-20T16:45:00Z',
    },
    {
        id: 'txn-5',
        type: 'withdrawal' as const,
        direction: 'out' as const,
        amount: 500000,
        description: 'Withdrawal to Techcombank ****5678',
        status: 'pending',
        createdAt: '2026-01-25T11:00:00Z',
    },
];

// Alias for wallet page
// Teacher transactions
export const fakeTeacherTransactions = [
    {
        id: 'ttxn-1',
        type: 'earning' as const,
        amount: 4500000,
        description: 'Complete React Development - 15 sales',
        status: 'completed',
        createdAt: '2026-01-20T10:00:00Z',
    },
    {
        id: 'ttxn-2',
        type: 'earning' as const,
        amount: 3200000,
        description: 'Python for Data Science - 8 sales',
        status: 'completed',
        createdAt: '2026-01-18T14:30:00Z',
    },
    {
        id: 'ttxn-3',
        type: 'withdrawal' as const,
        amount: 5000000,
        description: 'Withdrawal to Vietcombank ****1234',
        status: 'completed',
        createdAt: '2026-01-15T09:15:00Z',
    },
    {
        id: 'ttxn-4',
        type: 'earning' as const,
        amount: 2800000,
        description: 'Advanced JavaScript - 7 sales',
        status: 'pending',
        createdAt: '2026-01-25T16:45:00Z',
    },
    {
        id: 'ttxn-5',
        type: 'withdrawal' as const,
        amount: 3000000,
        description: 'Withdrawal to Techcombank ****5678',
        status: 'pending',
        createdAt: '2026-01-27T11:00:00Z',
    },
];

// Peer review assignments
export const fakePeerReviewsForPage = [
    {
        id: 'pr-1',
        assignmentTitle: 'Build a Responsive Landing Page',
        courseName: 'Advanced Web Development',
        status: 'pending',
        dueDate: '2026-02-01T23:59:59Z',
        submissionContent:
            'I created a landing page using HTML5 semantic elements and CSS Grid for the layout. The page includes a hero section with a background video, a features grid, testimonials carousel, and a contact form. I used CSS custom properties for theming and added smooth scroll navigation.\n\nKey features:\n- Fully responsive design using mobile-first approach\n- Accessible navigation with ARIA labels\n- Optimized images using srcset\n- CSS animations on scroll using Intersection Observer\n\nProject link: https://my-landing-page.vercel.app',
    },
    {
        id: 'pr-2',
        assignmentTitle: 'State Management Challenge',
        courseName: 'Complete React Development',
        status: 'pending',
        dueDate: '2026-02-05T23:59:59Z',
        submissionContent: null,
    },
    {
        id: 'pr-3',
        assignmentTitle: 'API Integration Project',
        courseName: 'Node.js Backend Development',
        status: 'pending',
        dueDate: '2026-02-10T23:59:59Z',
        submissionContent: null,
    },
];

// Alias for peer review page
// My submissions for peer review
export const fakeMySubmissions = [
    {
        id: 'sub-1',
        assignmentTitle: 'React Component Library',
        courseName: 'Complete React Development',
        reviewsRequired: 3,
        reviewsReceived: 3,
        finalGrade: 88,
        reviews: [
            {
                rating: 4,
                feedback:
                    'Great component architecture! Consider adding more TypeScript types for better DX.',
            },
            {
                rating: 5,
                feedback:
                    'Excellent work! Very clean code and well-documented props.',
            },
            {
                rating: 4,
                feedback:
                    'Good job overall. The styling could be more customizable.',
            },
        ],
    },
    {
        id: 'sub-2',
        assignmentTitle: 'REST API Design',
        courseName: 'Node.js Backend Development',
        reviewsRequired: 3,
        reviewsReceived: 2,
        finalGrade: null,
        reviews: [
            {
                rating: 4,
                feedback:
                    'Good API structure. Error handling could be improved.',
            },
            {
                rating: 5,
                feedback:
                    'Excellent documentation and follows REST conventions perfectly.',
            },
        ],
    },
    {
        id: 'sub-3',
        assignmentTitle: 'Data Visualization Dashboard',
        courseName: 'Python for Data Science',
        reviewsRequired: 3,
        reviewsReceived: 0,
        finalGrade: null,
        reviews: [],
    },
];

// Get course by ID
export function getCourseById(courseId: string): Course | undefined {
    return fakeCourses.find((c) => c.id === courseId);
}
