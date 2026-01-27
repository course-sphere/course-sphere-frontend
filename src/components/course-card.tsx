'use client';

import { Star, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export interface CourseCardProps {
    id: string;
    thumbnail: string;
    title: string;
    tags: string[];
    instructor: string;
    rating: number;
    reviews: number;
    students: number;
    price: number;
}

export function CourseCard({
    id,
    thumbnail,
    title,
    tags,
    instructor,
    rating,
    reviews,
    students,
    price,
}: CourseCardProps) {
    const router = useRouter();

    return (
        <Card
            onClick={() => router.push(`/course/${id}`)}
            className="flex max-w-lg flex-col overflow-hidden transition-shadow hover:shadow-lg"
        >
            <CardHeader>
                <CardTitle>
                    <img src={thumbnail} />
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-4 p-5">
                <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="text-foreground line-clamp-2 leading-snug font-semibold">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-xs">
                        by {instructor}
                    </p>
                </div>

                <div className="border-border space-y-3 border-t pt-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="text-blue-700 fill-blue-700 h-3 w-3" />
                            <span className="text-foreground text-xs font-medium">
                                {rating}
                            </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                            ({reviews})
                        </span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        {students.toLocaleString()} students
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-border flex items-center justify-between">
                <span className="text-foreground text-sm font-bold">
                    {price}
                </span>
                <Button variant="outline" size="sm">
                    Explore
                </Button>
            </CardFooter>
        </Card>
    );
}
