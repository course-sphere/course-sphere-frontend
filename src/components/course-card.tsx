'use client';

import { Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

import { CourseResponse } from '@/lib/service/course';

interface CourseCardProps {
    course?: CourseResponse;
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

    // 2. Map data an toàn: Tránh crash nếu backend trả về null/undefined
    const imageUrl =
        course.thumbnail_url || 'https://placehold.co/600x400?text=No+Image';
    const category =
        course.categories && course.categories.length > 0
            ? course.categories[0]
            : 'Uncategorized';
    const instructorName =
        course.instructor?.name ||
        course.instructor?.displayUsername ||
        'Unknown';

    // Mấy field backend chưa trả về thì mock tạm là 0 cho đẹp form
    const rating = 0;
    const ratingCount = 0;
    const students = 0;

    return (
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-muted relative h-48 w-full">
                <Image
                    className="object-cover"
                    src={imageUrl}
                    alt={course.title || 'Course Image'}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
            </div>

            <CardContent className="flex flex-1 flex-col space-y-4 p-5">
                <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                            {category}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                        >
                            {course.level || 'Beginner'}
                        </Badge>
                    </div>
                    <h3 className="text-foreground line-clamp-2 text-lg leading-snug font-semibold">
                        {course.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        by {instructorName}
                    </p>
                </div>

                <div className="border-border mt-auto space-y-3 border-t pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-foreground text-sm font-medium">
                                {rating}
                            </span>
                            <span className="text-muted-foreground text-sm">
                                ({ratingCount})
                            </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {/* Đã gán mạc định = 0 nên gọi toLocaleString() vô tư */}
                            {students.toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-border bg-muted/20 flex items-center justify-between border-t p-5">
                {/* Price giờ là dạng number nên check rất gọn */}
                {course.price === 0 ? (
                    <span className="text-foreground text-xl font-bold">
                        Free
                    </span>
                ) : (
                    <span className="text-foreground text-xl font-bold">
                        ${course.price}
                    </span>
                )}
                <Button asChild>
                    <Link href={`/course/${course.id}`}>Explore</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
