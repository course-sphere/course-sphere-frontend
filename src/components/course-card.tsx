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
import Image from 'next/image';
import Link from 'next/link';

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
    return (
        <Card className="flex max-w-lg flex-col overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle className="relative h-[200px]">
                    <Image
                        className="object-cover"
                        src={thumbnail}
                        alt={title}
                        fill
                    />
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-4 p-5">
                <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="text-foreground line-clamp-2 text-xl leading-snug font-semibold">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        by {instructor}
                    </p>
                </div>

                <div className="border-border space-y-3 border-t pt-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-blue-700 text-blue-700" />
                            <span className="text-foreground font-medium">
                                {rating}
                            </span>
                        </div>
                        <span className="text-muted-foreground">
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
                <span className="text-foreground text-lg font-bold">
                    {price}
                </span>
                <Button className="bg-blue-700" size="lg" asChild>
                    <Link href={`/course/${id}`}> Explore</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
