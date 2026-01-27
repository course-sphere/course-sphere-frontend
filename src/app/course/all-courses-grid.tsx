'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { allCourses, categories, levels } from '@/constant/sample-data';
import { Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function AllCoursesGrid() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    const filteredCourses = allCourses.filter((course) => {
        const categoryMatch =
            selectedCategory === 'All' || course.category === selectedCategory;
        const levelMatch =
            selectedLevel === 'All' || course.level === selectedLevel;
        return categoryMatch && levelMatch;
    });

    return (
        <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-foreground text-2xl font-bold">
                            All Courses
                        </h2>
                        <p
                            className="text-muted-foreground mt-1"
                            aria-live="polite"
                        >
                            {filteredCourses.length} courses available
                        </p>
                    </div>
                    <div
                        className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
                        aria-label="Course filters"
                        role="group"
                    >
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedLevel}
                            onValueChange={setSelectedLevel}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Level" />
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <div className="relative h-40">
                                <Image
                                    className="object-cover"
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                />
                            </div>

                            <div className="flex flex-1 flex-col space-y-4 p-5">
                                <div>
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {course.category}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {course.level}
                                        </Badge>
                                    </div>
                                    <h3 className="text-foreground line-clamp-2 leading-snug font-semibold">
                                        {course.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-2 text-xs">
                                        by {course.instructor}
                                    </p>
                                </div>

                                <div className="border-border space-y-3 border-t pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="fill-primary text-primary h-3 w-3" />
                                            <span className="text-foreground text-xs font-medium">
                                                {course.rating}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground text-xs">
                                            ({course.reviews})
                                        </span>
                                    </div>

                                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Users className="h-3 w-3" />
                                        {course.students.toLocaleString()}{' '}
                                        students
                                    </div>
                                </div>

                                <div className="border-border flex items-center justify-between border-t pt-4">
                                    <span className="text-foreground text-sm font-bold">
                                        {course.price}
                                    </span>
                                    <Button variant="outline" size="sm">
                                        Explore
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
