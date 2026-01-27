import { CourseCard, type CourseCardProps } from '@/components/course-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, School } from 'lucide-react';
import Image from 'next/image';

const allCourses: CourseCardProps[] = [
    {
        id: '1',
        title: 'Web Development Mastery',
        tags: ['Web Development'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Alex Johnson',
        students: 12450,
        rating: 4.8,
        reviews: 1203,
        price: 79.99,
    },
    {
        id: '2',
        title: 'Data Science Fundamentals',
        tags: ['Data Science'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Sarah Chen',
        students: 8920,
        rating: 4.9,
        reviews: 856,
        price: 89.99,
    },
    {
        id: '3',
        title: 'Mobile App Development',
        tags: ['Mobile'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Mike Rodriguez',
        students: 6780,
        rating: 4.7,
        reviews: 642,
        price: 79.99,
    },
    {
        id: '4',
        title: 'UI/UX Design Principles',
        tags: ['Design'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Emma Wilson',
        students: 5430,
        rating: 4.9,
        reviews: 728,
        price: 69.99,
    },
    {
        id: '5',
        title: 'Advanced React Patterns',
        tags: ['Web Development'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Alex Johnson',
        students: 9200,
        rating: 4.8,
        reviews: 945,
        price: 79.99,
    },
    {
        id: '6',
        title: 'Python for Machine Learning',
        tags: ['Data Science'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Sarah Chen',
        students: 7650,
        rating: 4.9,
        reviews: 723,
        price: 89.99,
    },
    {
        id: '7',
        title: 'React Native Mastery',
        thumbnail: '/placeholder.jpg',
        tags: ['Mobile'],
        instructor: 'Mike Rodriguez',
        students: 5120,
        rating: 4.7,
        reviews: 456,
        price: 79.99,
    },
    {
        id: '8',
        title: 'Figma Design Systems',
        tags: ['Design'],
        thumbnail: '/placeholder.jpg',
        instructor: 'Emma Wilson',
        students: 4890,
        rating: 4.8,
        reviews: 612,
        price: 69.99,
    },
];

export default function Home() {
    return (
        <div>
            <section className="from-background via-background to-primary/5 relative overflow-hidden bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="bg-primary/10 inline-block rounded-full px-4 py-1">
                                    <p className="text-primary text-sm font-medium">
                                        <School className="inline size-6" />{' '}
                                        Learn Anything, Anytime
                                    </p>
                                </div>
                                <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl">
                                    Master New Skills at Your Own Pace
                                </h1>
                                <p className="text-muted-foreground max-w-lg text-lg">
                                    Access world-class courses from expert
                                    instructors. Learn practical skills that
                                    directly impact your career growth.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Button size="lg" className="gap-2">
                                    Start Learning Free
                                    <ArrowRight className="size-4" />
                                </Button>
                                <Button variant="outline" size="lg">
                                    Watch Demo
                                </Button>
                            </div>

                            <div className="border-border grid grid-cols-3 gap-6 border-t pt-8">
                                <div>
                                    <p className="text-foreground text-2xl font-bold">
                                        150K+
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Active Learners
                                    </p>
                                </div>
                                <div>
                                    <p className="text-foreground text-2xl font-bold">
                                        500+
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Expert Courses
                                    </p>
                                </div>
                                <div>
                                    <p className="text-foreground text-2xl font-bold">
                                        98%
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-80 overflow-hidden rounded-2xl border sm:h-96 lg:h-full">
                            <Image
                                className="object-cover"
                                src="/placeholder.jpg"
                                alt="hero"
                                fill
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
