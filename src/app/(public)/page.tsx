'use client';

import { useEffect } from 'react';
import { CourseCard } from '@/components/course-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import {
    ArrowRight,
    Award,
    Briefcase,
    Clock,
    Globe,
    School,
    Users,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const courses = [
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
];

const features = [
    {
        icon: Award,
        title: 'Learn from the Best',
        description:
            'Get taught by industry experts with years of real-world experience',
    },
    {
        icon: Clock,
        title: 'Learn at Your Pace',
        description:
            'Access lifetime course materials and learn whenever it suits you',
    },
    {
        icon: Users,
        title: 'Community Support',
        description:
            'Connect with thousands of learners and get help when you need it',
    },
    {
        icon: Zap,
        title: 'Practical Projects',
        description:
            'Build real-world projects that you can showcase in your portfolio',
    },
    {
        icon: Briefcase,
        title: 'Earn Certificates',
        description:
            'Get recognized with shareable certificates upon course completion',
    },
    {
        icon: Globe,
        title: 'Global Reach',
        description: 'Learn from instructors and students around the world',
    },
];

export default function Home() {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isCheckingAuth && isAuthenticated && user) {
            switch (user.role) {
                case 'student':
                    router.replace('/course');
                    break;
                case 'instructor':
                case 'admin':
                    router.replace('/dashboard');
                    break;
            }
        }
    }, [isCheckingAuth, isAuthenticated, user, router]);

    if (isCheckingAuth || isAuthenticated) return null;

    return (
        <div>
            <section className="from-background via-background to-primary/5 relative overflow-hidden bg-linear-to-br px-4 py-20 sm:px-6 lg:px-8">
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

            <section
                id="courses"
                className="bg-background px-4 py-20 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 space-y-4 text-center">
                        <Badge variant="secondary">Popular Courses</Badge>
                        <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
                            Learn from Industry Experts
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Explore our handpicked collection of courses
                            designed to help you advance your career
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {courses.map((course) => (
                            <CourseCard key={course.id} {...course} />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/courses">View All Courses</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section
                id="features"
                className="bg-card border-border border-y px-4 py-20 sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 space-y-4 text-center">
                        <Badge variant="secondary">Why Choose Us</Badge>
                        <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            We provide comprehensive tools and resources to
                            ensure your learning journey is successful
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="p-6 transition-shadow hover:shadow-lg"
                            >
                                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                                    <feature.icon className="text-primary h-6 w-6" />
                                </div>
                                <h3 className="text-foreground mb-2 text-lg font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
