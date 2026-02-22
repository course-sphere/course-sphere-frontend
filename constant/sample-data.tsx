import {
    Assignment,
    AssignmentSubmission,
    PeerReview,
} from '@/lib/service/assignment/type';
import type {
    Course,
    CourseDetailResponse,
    CourseModule,
} from '@/lib/service/course';
import {
    AdminStats,
    StudentStats,
    TeacherStats,
} from '@/lib/service/dashboard/type';
import { Comment } from '@/lib/service/discussion/type';
import { Enrollment } from '@/lib/service/enrollment/type';
import { LearnMaterialContent, Lesson, LessonItem } from '@/lib/service/lesson';
import { Module } from '@/lib/service/module';
import { Quiz } from '@/lib/service/quiz/type';
import { Report } from '@/lib/service/report/type';
import {
    CourseSyllabusResponse,
    LearnSyllabusResponse,
} from '@/lib/service/syllabus/type';
import { User } from '@/lib/service/user';
import {
    Transaction,
    Wallet,
    WithdrawRequest,
} from '@/lib/service/wallet/type';

// default modules use in /course/{id}
const defaultModules: CourseModule[] = [
    {
        id: 'module-1',
        title: 'Foundations',
        description: 'Build core skills with guided practice',
        lessons: [
            {
                id: 'lesson-1',
                title: 'Core Concepts',
                type: 'video',
                duration: '18 min',
                completed: false,
            },
            {
                id: 'lesson-2',
                title: 'Hands-on Exercise',
                type: 'exercise',
                duration: '30 min',
                completed: false,
            },
        ],
    },
    {
        id: 'module-2',
        title: 'Applied Skills',
        description: 'Turn knowledge into real-world outcomes',
        lessons: [
            {
                id: 'lesson-3',
                title: 'Mini Project',
                type: 'project',
                duration: '60 min',
                completed: false,
            },
            {
                id: 'lesson-4',
                title: 'Best Practices',
                type: 'video',
                duration: '22 min',
                completed: false,
            },
        ],
    },
];
// sample course use in /course
export const fakeCourses: Course[] = [
    {
        id: '1',
        title: 'Advanced React & Next.js Mastery',
        category: 'Web Development',
        description:
            'Build modern, scalable web applications with React 19 and Next.js 16. Learn from industry experts and master the latest patterns, performance optimization, and real-world best practices.',
        rating: 5,
        ratingCount: 2847,
        instructor: 'Sarah Chen',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '32 hours of content',
        level: 'Advanced',
        students: 12340,
        price: '$99.99',
        status: 'published',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        modules: [
            {
                id: 'module-1',
                title: 'React Fundamentals & Hooks',
                description: 'Master the basics of React and modern hooks',
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'Introduction to React 19',
                        type: 'video',
                        duration: '15 min',
                        completed: true,
                    },
                    {
                        id: 'lesson-2',
                        title: 'JSX and Components',
                        type: 'video',
                        duration: '20 min',
                        completed: true,
                    },
                    {
                        id: 'lesson-3',
                        title: 'Hooks Deep Dive',
                        type: 'exercise',
                        duration: '30 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-4',
                        title: 'Custom Hooks',
                        type: 'exercise',
                        duration: '25 min',
                        completed: false,
                    },
                ],
            },
            {
                id: 'module-2',
                title: 'Next.js 16 Advanced Features',
                description:
                    'Explore Server Components, App Router, and optimization',
                lessons: [
                    {
                        id: 'lesson-5',
                        title: 'Server Components Introduction',
                        type: 'video',
                        duration: '18 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-6',
                        title: 'App Router Patterns',
                        type: 'video',
                        duration: '22 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-7',
                        title: 'Middleware & Auth',
                        type: 'exercise',
                        duration: '35 min',
                        completed: false,
                    },
                ],
            },
            {
                id: 'module-3',
                title: 'Performance & Optimization',
                description:
                    'Learn caching, rendering strategies, and performance metrics',
                lessons: [
                    {
                        id: 'lesson-8',
                        title: 'Image & Font Optimization',
                        type: 'video',
                        duration: '20 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-9',
                        title: 'Caching Strategies',
                        type: 'exercise',
                        duration: '40 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-10',
                        title: 'Real-world Performance Project',
                        type: 'project',
                        duration: '120 min',
                        completed: false,
                    },
                ],
            },
            {
                id: 'module-4',
                title: 'Full-Stack Project',
                description: 'Build a complete production-ready application',
                lessons: [
                    {
                        id: 'lesson-11',
                        title: 'Project Planning & Setup',
                        type: 'video',
                        duration: '25 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-12',
                        title: 'Database & API Integration',
                        type: 'exercise',
                        duration: '60 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-13',
                        title: 'Final Project Submission',
                        type: 'project',
                        duration: '180 min',
                        completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        title: 'Python for Data Science',
        category: 'Data Science',
        description:
            'Master Python programming for data analysis, visualization, and machine learning with hands-on projects.',
        rating: 5,
        ratingCount: 1924,
        instructor: 'Michael Rodriguez',
        lastUpdated: 'December 2025',
        language: 'English',
        duration: '40 hours of content',
        level: 'Intermediate',
        students: 8765,
        price: '$89.99',
        status: 'published',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        modules: [
            {
                id: 'module-1',
                title: 'Python Fundamentals',
                description: 'Learn Python basics and data structures',
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'Python Syntax & Variables',
                        type: 'video',
                        duration: '20 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-2',
                        title: 'Data Types & Collections',
                        type: 'exercise',
                        duration: '30 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-3',
                        title: 'Functions & Modules',
                        type: 'video',
                        duration: '25 min',
                        completed: false,
                    },
                ],
            },
            {
                id: 'module-2',
                title: 'Data Analysis with Pandas',
                description: 'Work with datasets and perform analysis',
                lessons: [
                    {
                        id: 'lesson-4',
                        title: 'DataFrames & Series',
                        type: 'video',
                        duration: '30 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-5',
                        title: 'Data Cleaning',
                        type: 'exercise',
                        duration: '45 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-6',
                        title: 'Analysis Project',
                        type: 'project',
                        duration: '120 min',
                        completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: '3',
        title: 'Figma UI/UX Design Masterclass',
        category: 'Design',
        description:
            'Create stunning user experiences using Figma. Learn design principles, prototyping, and real-world workflows.',
        rating: 5,
        status: 'published',
        ratingCount: 1456,
        instructor: 'Emily Zhang',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '28 hours of content',
        level: 'Beginner',
        students: 6234,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
        modules: [
            {
                id: 'module-1',
                title: 'Figma Essentials',
                description: 'Master Figma interface and tools',
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'Figma Interface Tour',
                        type: 'video',
                        duration: '25 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-2',
                        title: 'Components & Variants',
                        type: 'exercise',
                        duration: '40 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-3',
                        title: 'Prototyping Basics',
                        type: 'video',
                        duration: '20 min',
                        completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: '4',
        title: 'Mobile App Development with React Native',
        category: 'Mobile',
        description:
            'Build cross-platform mobile apps with React Native. Deploy to iOS and Android from a single codebase.',
        rating: 5,
        status: 'published',
        ratingCount: 987,
        instructor: 'James Wilson',
        lastUpdated: 'November 2025',
        language: 'English',
        duration: '35 hours of content',
        level: 'Advanced',
        students: 4321,
        price: '$94.99',
        image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80',
        modules: [
            {
                id: 'module-1',
                title: 'React Native Fundamentals',
                description: 'Get started with React Native',
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'Setup & Environment',
                        type: 'video',
                        duration: '15 min',
                        completed: false,
                    },
                    {
                        id: 'lesson-2',
                        title: 'Core Components',
                        type: 'exercise',
                        duration: '35 min',
                        completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: '5',
        title: 'Web Development Mastery',
        category: 'Web Development',
        description:
            'Learn modern HTML, CSS, and JavaScript with projects that build confidence and real-world skills.',
        rating: 4.8,
        ratingCount: 1203,
        instructor: 'Alex Johnson',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '22 hours of content',
        level: 'Beginner',
        students: 12450,
        status: 'published',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '6',
        title: 'Data Science Fundamentals',
        category: 'Data Science',
        description:
            'Build a solid data science foundation covering statistics, Python, and machine learning workflows.',
        rating: 4.9,
        ratingCount: 856,
        instructor: 'Sarah Chen',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '26 hours of content',
        level: 'Beginner',
        status: 'published',
        students: 8920,
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '7',
        title: 'Mobile App Development',
        category: 'Mobile',
        description:
            'Design, build, and ship mobile apps with best-practice UX and performance techniques.',
        rating: 4.7,
        ratingCount: 642,
        instructor: 'Mike Rodriguez',
        lastUpdated: 'December 2025',
        status: 'published',
        language: 'English',
        duration: '24 hours of content',
        level: 'Intermediate',
        students: 6780,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '8',
        title: 'UI/UX Design Principles',
        category: 'Design',
        description:
            'Learn the fundamentals of user-centered design, research, and prototyping for modern products.',
        rating: 4.9,
        ratingCount: 728,
        status: 'published',
        instructor: 'Emma Wilson',
        lastUpdated: 'December 2025',
        language: 'English',
        duration: '18 hours of content',
        level: 'Beginner',
        students: 5430,
        price: '$69.99',
        image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '9',
        title: 'Advanced React Patterns',
        category: 'Web Development',
        description:
            'Level up your React skills with scalable patterns, performance tuning, and testing strategies.',
        rating: 4.8,
        ratingCount: 945,
        status: 'published',
        instructor: 'Alex Johnson',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '20 hours of content',
        level: 'Advanced',
        students: 9200,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '10',
        title: 'Python for Machine Learning',
        category: 'Data Science',
        description:
            'Apply Python to real ML problems with feature engineering, training, and model evaluation.',
        rating: 4.9,
        ratingCount: 723,
        status: 'published',
        instructor: 'Sarah Chen',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '30 hours of content',
        level: 'Intermediate',
        students: 7650,
        price: '$0',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '11',
        title: 'React Native Mastery',
        category: 'Mobile',
        description:
            'Build polished cross-platform apps using React Native and a modern tooling stack.',
        rating: 4.7,
        ratingCount: 456,
        instructor: 'Mike Rodriguez',
        lastUpdated: 'November 2025',
        status: 'published',
        language: 'English',
        duration: '26 hours of content',
        level: 'Intermediate',
        students: 5120,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '12',
        title: 'Figma Design Systems',
        category: 'Design',
        description:
            'Create scalable design systems in Figma with tokens, components, and documentation.',
        rating: 4.8,
        ratingCount: 612,
        instructor: 'Emma Wilson',
        lastUpdated: 'December 2025',
        language: 'English',
        status: 'published',
        duration: '16 hours of content',
        level: 'Intermediate',
        students: 4890,
        price: '$69.99',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '13',
        title: 'Full-Stack JavaScript',
        category: 'Web Development',
        description:
            'Build complete web apps using Node.js, databases, and modern frontend frameworks.',
        rating: 4.8,
        ratingCount: 1087,
        instructor: 'Alex Johnson',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '34 hours of content',
        status: 'published',
        level: 'Beginner',
        students: 10230,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '14',
        title: 'Deep Learning Specialization',
        category: 'Data Science',
        description:
            'Dive into deep learning with neural networks, tuning, and real-world applications.',
        rating: 4.9,
        ratingCount: 534,
        instructor: 'Sarah Chen',
        lastUpdated: 'January 2026',
        status: 'published',
        language: 'English',
        duration: '36 hours of content',
        level: 'Advanced',
        students: 6540,
        price: '$99.99',
        image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '15',
        title: 'iOS Development with Swift',
        category: 'Mobile',
        description:
            'Learn Swift fundamentals and build iOS apps that feel fast and native.',
        rating: 4.7,
        ratingCount: 389,
        instructor: 'Mike Rodriguez',
        lastUpdated: 'November 2025',
        language: 'English',
        duration: '28 hours of content',
        status: 'published',
        level: 'Intermediate',
        students: 4320,
        price: '$84.99',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '16',
        title: 'Web Design Essentials',
        category: 'Design',
        description:
            'Learn layout, typography, and responsive design essentials for modern web experiences.',
        rating: 4.9,
        ratingCount: 876,
        instructor: 'Emma Wilson',
        lastUpdated: 'December 2025',
        language: 'English',
        duration: '20 hours of content',
        status: 'published',
        level: 'Beginner',
        students: 8765,
        price: '$69.99',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '17',
        title: 'Node.js API Engineering',
        category: 'Web Development',
        description:
            'Build secure, scalable APIs with Node.js, authentication, and testing strategies.',
        rating: 4.7,
        ratingCount: 512,
        instructor: 'Jordan Lee',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '18 hours of content',
        status: 'published',
        level: 'Intermediate',
        students: 7340,
        price: '$84.99',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '18',
        title: 'Data Visualization with D3',
        category: 'Data Science',
        status: 'published',
        description:
            'Turn data into compelling stories with D3.js, charts, and interaction patterns.',
        rating: 4.6,
        ratingCount: 367,
        instructor: 'Priya Patel',
        lastUpdated: 'December 2025',
        language: 'English',
        duration: '16 hours of content',
        level: 'Intermediate',
        students: 4980,
        price: '$74.99',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '19',
        title: 'Android Development with Kotlin',
        category: 'Mobile',
        description:
            'Ship Android apps with Kotlin, Jetpack components, and modern architecture patterns.',
        rating: 4.8,
        ratingCount: 441,
        status: 'published',
        instructor: 'Diego Torres',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '26 hours of content',
        level: 'Beginner',
        students: 5890,
        price: '$84.99',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '20',
        title: 'Product Design Workshop',
        category: 'Design',
        status: 'published',
        description:
            'Design end-to-end product experiences with research, flows, and high-fidelity prototypes.',
        rating: 4.7,
        ratingCount: 305,
        instructor: 'Avery Kim',
        lastUpdated: 'December 2025',
        language: 'English',
        duration: '14 hours of content',
        level: 'Intermediate',
        students: 4020,
        price: '$72.99',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '21',
        title: 'TypeScript for Professionals',
        category: 'Web Development',
        description:
            'Master TypeScript with advanced types, architecture patterns, and migration strategies.',
        rating: 4.8,
        ratingCount: 690,
        instructor: 'Morgan Reed',
        lastUpdated: 'January 2026',
        language: 'English',
        duration: '22 hours of content',
        status: 'published',
        level: 'Advanced',
        students: 8150,
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
    {
        id: '22',
        title: 'AI for Product Teams',
        category: 'Data Science',
        description:
            'Understand AI fundamentals and apply them to product strategy and delivery.',
        rating: 4.6,
        ratingCount: 274,
        instructor: 'Noah Brooks',
        lastUpdated: 'January 2026',
        status: 'published',
        language: 'English',
        duration: '12 hours of content',
        level: 'Beginner',
        students: 3650,
        price: '$94.99',
        image: 'https://images.unsplash.com/photo-1526378722370-4e7d8a0a8d3b?auto=format&fit=crop&w=1200&q=80',
        modules: defaultModules,
    },
];
// category to perform filter in /course
export const categories = [
    'All',
    'Web Development',
    'Data Science',
    'Mobile',
    'Design',
];
// level to perform filter in /course
export const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// course-syllabus-sample use in /course/{id} and /course/{id}/learn sidebar
export const mockStudentSyllabus: CourseSyllabusResponse = {
    course_id: '10',
    course_title: 'Python for Machine Learning',
    modules: [
        {
            id: 'mod-1',
            course_id: '10',
            title: 'Module 1: Introduction & Environment',
            sort_order: 1,
            lessons: [
                {
                    id: 'les-1-1',
                    module_id: 'mod-1',
                    title: '1.1. Getting Started with Python ML',
                    sort_order: 1,
                    materials: [
                        {
                            id: 'mat-1',
                            lesson_id: 'les-1-1',
                            item_type: 'video',
                            title: 'Course Introduction',
                            sort_order: 1,
                            is_required: true,
                            is_preview: true,
                            is_completed: true,
                            duration: 15,
                        },
                        {
                            id: 'mat-2',
                            lesson_id: 'les-1-1',
                            item_type: 'reading',
                            title: 'Jupyter Notebook Setup Guide',
                            sort_order: 2,
                            is_required: true,
                            is_preview: false,
                            is_completed: true,
                            duration: 10,
                        },
                    ],
                },
            ],
        },
        {
            id: 'mod-2',
            course_id: '10',
            title: 'Module 2: Data Preprocessing',
            sort_order: 2,
            lessons: [
                {
                    id: 'les-2-1',
                    module_id: 'mod-2',
                    title: '2.1. Feature Engineering',
                    sort_order: 1,
                    materials: [
                        {
                            id: 'mat-3',
                            lesson_id: 'les-2-1',
                            item_type: 'coding',
                            title: 'Clean the Titanic Dataset',
                            sort_order: 1,
                            is_required: true,
                            is_preview: false,
                            is_completed: false,
                        },
                        {
                            id: 'mat-4',
                            lesson_id: 'les-2-1',
                            item_type: 'quiz',
                            title: 'Pandas Knowledge Check',
                            sort_order: 2,
                            is_required: true,
                            is_preview: false,
                            is_completed: false,
                            duration: 15,
                        },
                        {
                            id: 'mat-5',
                            lesson_id: 'les-2-1',
                            item_type: 'file',
                            title: 'Download Dataset (CSV)',
                            sort_order: 3,
                            is_required: false,
                            is_preview: false,
                            is_completed: false,
                            file_type: 'csv',
                        },
                    ],
                },
            ],
        },
    ],
};

export const mockMaterialDetails: Record<string, LearnMaterialContent> = {
    'mat-1': {
        id: 'mat-1',
        lesson_id: 'les-1-1',
        item_type: 'video',
        title: 'Course Introduction',
        sort_order: 1,
        is_required: true,
        is_preview: true,
        is_completed: true,
        video_data: {
            video_url:
                'https://www.youtube.com/watch?v=RlTDbIutJsU&list=RDRlTDbIutJsU',
            duration: 15,
            description:
                '<p class="text-node">Welcome to Python for Machine Learning! In this introductory video, instructor Sarah Chen walks you through the curriculum.</p>',
        },
    },

    'mat-2': {
        id: 'mat-2',
        lesson_id: 'les-1-1',
        item_type: 'reading',
        title: 'Jupyter Notebook Setup Guide',
        sort_order: 2,
        is_required: true,
        is_preview: false,
        is_completed: true,
        reading_data: {
            duration: 5,
            content:
                '<h2 class="text-node">Step 1: Install Python</h2><p class="text-node">Download Python 3.10+ from python.org.</p><h2 class="text-node">Step 2: Install Jupyter</h2><p class="text-node">Run <code>pip install jupyter</code> in your terminal.</p>',
        },
    },

    'mat-3': {
        id: 'mat-3',
        lesson_id: 'les-2-1',
        item_type: 'coding',
        title: 'Clean the Titanic Dataset',
        sort_order: 1,
        is_required: true,
        is_preview: false,
        is_completed: false,
        coding_data: {
            description:
                'Apply data cleaning techniques on the Titanic dataset.',
            instructions:
                '<p class="text-node"><strong>Task:</strong> Drop all rows with missing "Age" values in the dataframe <code>df</code>.</p>',
            starter_code:
                'import pandas as pd\n\ndef clean_titanic_data(df):\n    # Drop remaining NA rows\n    \n    return df\n',
            language: 'python',
            max_score: 100,
            due_days: 7,
        },
    },

    'mat-4': {
        id: 'mat-4',
        lesson_id: 'les-2-1',
        item_type: 'quiz',
        title: 'Pandas Knowledge Check',
        sort_order: 2,
        is_required: true,
        is_preview: false,
        is_completed: false,
        quiz_data: {
            description:
                '<p class="text-node">Do not use AI for this quiz.</p>',
            time_limit_minutes: 15,
            passing_score: 50,
            questions: [
                {
                    id: 'q1',
                    title: 'Which Pandas method is used to drop missing values?',
                    question_type: 'single',
                    score: 10,
                    explanation:
                        '<p class="text-node">dropna() is the standard method to remove missing values in pandas.</p>',
                    answers: [
                        { id: 'a-1', content: 'df.dropna()', is_correct: true },
                        {
                            id: 'a-2',
                            content: 'df.remove_na()',
                            is_correct: false,
                        },
                    ],
                },
                {
                    id: 'q2',
                    title: 'Pandas is built on top of NumPy?',
                    question_type: 'true_false',
                    score: 5,
                    explanation:
                        '<p class="text-node">Yes, Pandas Series and DataFrames heavily rely on NumPy arrays.</p>',
                    answers: [
                        { id: 'a-3', content: 'True', is_correct: true },
                        { id: 'a-4', content: 'False', is_correct: false },
                    ],
                },
            ],
        },
    },

    'mat-5': {
        id: 'mat-5',
        lesson_id: 'les-2-1',
        item_type: 'file',
        title: 'Download Dataset (CSV)',
        sort_order: 3,
        is_required: false,
        is_preview: false,
        is_completed: false,
        file_data: {
            file_url: 'https://s3.your-bucket.com/uploads/titanic_dataset.csv',
            file_type: 'csv',
            file_size: 102450,
        },
    },
};

export const mockLearnSyllabus: LearnSyllabusResponse = {
    ...mockStudentSyllabus,
    progress: {
        percentage: 40,
        completed_materials: 2,
        total_materials: 5,
    },
    active_material_id: 'mat-3',
};

// sample user
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
        role: 'instructor',
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
        role: 'instructor',
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

// lesson items
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
export const fakeModules: Module[] = [
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

// mock data for course/{id}
export const mockCourseDetail: CourseDetailResponse = {
    id: '10',
    title: 'Python for Machine Learning',
    subtitle:
        'Apply Python to real ML problems with feature engineering, training, and model evaluation.',
    description:
        'A comprehensive guide to practical Machine Learning. You will learn data preprocessing, feature engineering, and how to build robust predictive models using Python, Scikit-Learn, and Pandas.',
    category: [
        { id: 'cat-ds', text: 'Data Science' },
        { id: 'cat-ml', text: 'Machine Learning' },
    ],
    level: 'intermediate',
    thumbnail_url:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    promo_video_url: 'https://www.youtube.com/watch?v=R6cM5ww7g-o',

    is_free: true,
    price: 0,
    discount_price: 0,

    prerequisites: [
        { course_id: 'course-basic-py', course_title: 'Python Basics' },
    ],
    requirements: [
        'Basic understanding of Python syntax',
        'High school level mathematics',
    ],
    learning_objectives: [
        'Master Pandas for data manipulation',
        'Build and evaluate Machine Learning models',
        'Deploy ML models via REST APIs',
    ],
    instructor: {
        id: 'user-sarah',
        name: 'Sarah Chen',
        avatar_url: 'https://i.pravatar.cc/150?u=sarah',
    },
    status: 'published',
    rating: 4.9,
    rating_count: 723,
    enrolled_students: 7650,
    total_video_duration_minutes: 1800,
    total_coding_exercises: 25,
    total_file_resources: 5,
    target_audience: [
        'Aspiring Data Scientists',
        'Python developers wanting to transition to ML',
        'University students learning Data Science',
    ],
    created_at: '2025-10-12T08:00:00Z',
    updated_at: '2026-02-20T10:30:00Z',
};

// Get course by ID
export function getCourseById(courseId: string): Course | undefined {
    return fakeCourses.find((c) => c.id === courseId);
}

export function getCoursesByCategory(category: string) {
    return fakeCourses.filter((course) => course.category === category);
}
