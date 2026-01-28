'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Users,
    Code,
    Database,
    Palette,
    Smartphone,
    BarChart3,
    ArrowRight,
} from 'lucide-react';

const allPaths = [
    {
        id: 1,
        icon: Code,
        title: 'Full-Stack Web Developer',
        description:
            'Master modern web development with React, Node.js, and databases. Build production-ready applications from frontend to backend.',
        duration: '120+ hours',
        courses: 8,
        students: 24500,
        level: 'Beginner → Advanced',
    },
    {
        id: 2,
        icon: Database,
        title: 'Data Science & Analytics',
        description:
            'Learn Python, data analysis, visualization, and machine learning to extract insights from data and build predictive models.',
        duration: '140+ hours',
        courses: 10,
        students: 18900,
        level: 'Beginner → Advanced',
    },
    {
        id: 3,
        icon: Palette,
        title: 'UI/UX Design Fundamentals',
        description:
            'Create beautiful, user-centered digital experiences. Learn design principles, tools, and workflows used by leading companies.',
        duration: '90+ hours',
        courses: 7,
        students: 16200,
        level: 'Beginner → Intermediate',
    },
    {
        id: 4,
        icon: Smartphone,
        title: 'Mobile App Development',
        description:
            'Build cross-platform mobile applications with React Native and Expo. Deploy to iOS and Android platforms.',
        duration: '110+ hours',
        courses: 8,
        students: 14300,
        level: 'Intermediate → Advanced',
    },
    {
        id: 5,
        icon: Code,
        title: 'Frontend Development Pro',
        description:
            'Become a frontend expert with advanced React, TypeScript, testing, and performance optimization techniques.',
        duration: '100+ hours',
        courses: 7,
        students: 12800,
        level: 'Intermediate → Advanced',
    },
    {
        id: 6,
        icon: Database,
        title: 'Backend Engineering Essentials',
        description:
            'Master server-side development with Node.js, databases, APIs, and cloud deployment on AWS or Google Cloud.',
        duration: '115+ hours',
        courses: 8,
        students: 11200,
        level: 'Beginner → Advanced',
    },
    {
        id: 7,
        icon: BarChart3,
        title: 'Business Analytics',
        description:
            'Learn to analyze business data, create compelling dashboards, and make data-driven decisions using Tableau and Power BI.',
        duration: '85+ hours',
        courses: 6,
        students: 9400,
        level: 'Beginner → Intermediate',
    },
    {
        id: 8,
        icon: Code,
        title: 'DevOps & Cloud Engineering',
        description:
            'Master containerization, orchestration, CI/CD pipelines, and infrastructure as code using Docker, Kubernetes, and AWS.',
        duration: '105+ hours',
        courses: 8,
        students: 7600,
        level: 'Intermediate → Advanced',
    },
];

const levels = [
    'All',
    'Beginner → Intermediate',
    'Beginner → Advanced',
    'Intermediate → Advanced',
];

export function AllLearningPathsGrid() {
    const [selectedLevel, setSelectedLevel] = useState('All');

    const filteredPaths = allPaths.filter((path) => {
        return selectedLevel === 'All' || path.level === selectedLevel;
    });

    return (
        <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-foreground text-2xl font-bold">
                            All Learning Paths
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {filteredPaths.length} paths available
                        </p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Select
                            value={selectedLevel}
                            onValueChange={setSelectedLevel}
                        >
                            <SelectTrigger className="w-full sm:w-56">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {levels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {filteredPaths.map((path) => {
                        const PathIcon = path.icon;
                        return (
                            <Card
                                key={path.id}
                                className="border-border hover:border-accent/50 overflow-hidden border transition-colors"
                            >
                                <div className="flex h-full flex-col p-6">
                                    <div className="mb-4 flex items-start gap-4">
                                        <div className="bg-primary/10 flex-shrink-0 rounded-lg p-3">
                                            <PathIcon className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground text-xl font-bold">
                                                {path.title}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className="mt-2"
                                            >
                                                {path.level}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-foreground mb-6 flex-grow text-sm">
                                        {path.description}
                                    </p>

                                    <div className="border-border mb-6 grid gap-3 border-y py-4 sm:grid-cols-3">
                                        <div>
                                            <p className="text-muted-foreground text-xs">
                                                Duration
                                            </p>
                                            <p className="text-foreground text-sm font-semibold">
                                                {path.duration}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">
                                                Courses
                                            </p>
                                            <p className="text-foreground text-sm font-semibold">
                                                {path.courses} courses
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">
                                                Learners
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <Users className="text-muted-foreground h-3 w-3" />
                                                <p className="text-foreground text-sm font-semibold">
                                                    {(
                                                        path.students / 1000
                                                    ).toFixed(1)}
                                                    k+
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <Button className="flex-1">
                                            Start Path
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 bg-transparent"
                                            size="sm"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
