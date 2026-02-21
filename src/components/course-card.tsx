'use client';

import { Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/service/course';

interface CourseCardProps {
    course?: Course;
    isLoading?: boolean;
}

export function CourseCard({ course, isLoading }: CourseCardProps) {
    if (isLoading || !course) {
        return (
            <Card className="flex h-full flex-col overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="flex flex-1 flex-col space-y-4 p-5">
                    <div>
                        <div className="mb-3 flex gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-4/5" />
                        </div>
                        <Skeleton className="mt-4 h-4 w-32" />
                    </div>
                    <div className="border-border mt-auto border-t pt-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-border bg-muted/20 flex items-center justify-between border-t p-5">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-48 w-full">
                <Image
                    className="object-cover"
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
            </div>

            <CardContent className="flex flex-1 flex-col space-y-4 p-5">
                <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                            {course.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            {course.level}
                        </Badge>
                    </div>
                    <h3 className="text-foreground line-clamp-2 text-lg leading-snug font-semibold">
                        {course.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        by {course.instructor}
                    </p>
                </div>

                <div className="border-border mt-auto space-y-3 border-t pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-foreground text-sm font-medium">
                                {course.rating}
                            </span>
                            <span className="text-muted-foreground text-sm">
                                ({course.ratingCount})
                            </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {course.students.toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-border bg-muted/20 flex items-center justify-between border-t p-5">
                <span className="text-foreground text-xl font-bold">
                    {course.price}
                </span>
                <Button asChild>
                    <Link href={`/course/${course.id}`}>Explore</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
