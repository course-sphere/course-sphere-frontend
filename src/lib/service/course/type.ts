export type CourseLesson = {
    id: string;
    title: string;
    type: 'video' | 'exercise' | 'project';
    duration?: string;
    completed?: boolean;
};

export type CourseModule = {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
};

export type Course = {
    id: string;
    title: string;
    category: string;
    description: string;
    rating: number;
    ratingCount: number;
    instructor: string;
    lastUpdated: string;
    language: string;
    duration: string;
    level: string;
    students: number;
    price: string;
    image: string;
    modules: CourseModule[];
};
