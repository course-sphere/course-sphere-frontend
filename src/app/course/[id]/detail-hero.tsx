'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Award, Star, BarChart3 } from 'lucide-react';
import React from 'react';

interface DetailHeroProps {
    type: 'course' | 'learning-path';
    category: string;
    title: string;
    description: string;
    rating?: number;
    ratingCount?: number;
    instructor?: string;
    lastUpdated?: string;
    language?: string;
    duration: string;
    level: string;
    students: number;
    includesCertificate?: boolean;
    price?: string;
    imageIcon?: React.ReactNode;
    progress?: number;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
}

export function DetailHero({
    type,
    category,
    title,
    description,
    rating,
    ratingCount,
    instructor,
    lastUpdated,
    language,
    duration,
    level,
    students,
    includesCertificate = true,
    price,
    imageIcon,
    progress,
    onPrimaryAction,
    onSecondaryAction,
    primaryActionLabel = type === 'course' ? 'Enroll Now' : 'Start Path',
    secondaryActionLabel = type === 'course'
        ? 'Add to Wishlist'
        : 'View Details',
}: DetailHeroProps) {
    return (
        <div className="border-border from-background to-muted/30 border-b bg-linear-to-br">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center gap-3">
                            <Badge variant="secondary">{category}</Badge>
                            {rating && ratingCount && (
                                <div className="flex items-center gap-1">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="fill-accent text-accent h-4 w-4"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-muted-foreground text-sm">
                                        ({ratingCount.toLocaleString()})
                                    </span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight text-balance lg:text-5xl">
                            {title}
                        </h1>

                        <p className="text-muted-foreground mb-6 text-lg text-pretty">
                            {description}
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            {instructor && (
                                <>
                                    <div>
                                        <p className="text-muted-foreground text-sm">
                                            Instructor
                                        </p>
                                        <p className="text-foreground font-semibold">
                                            {instructor}
                                        </p>
                                    </div>
                                    <div className="border-border hidden border-l sm:block" />
                                </>
                            )}
                            {lastUpdated && (
                                <>
                                    <div>
                                        <p className="text-muted-foreground text-sm">
                                            Last Updated
                                        </p>
                                        <p className="text-foreground font-semibold">
                                            {lastUpdated}
                                        </p>
                                    </div>
                                    <div className="border-border hidden border-l sm:block" />
                                </>
                            )}
                            {language && (
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Language
                                    </p>
                                    <p className="text-foreground font-semibold">
                                        {language}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                            {imageIcon && (
                                <div className="bg-muted mb-4 flex aspect-video items-center justify-center rounded-lg">
                                    {imageIcon}
                                </div>
                            )}

                            <div className="mb-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-accent h-5 w-5" />
                                    <span className="text-sm">{duration}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="text-accent h-5 w-5" />
                                    <span className="text-sm">{level}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="text-accent h-5 w-5" />
                                    <span className="text-sm">
                                        {typeof students === 'number' &&
                                        students > 1000
                                            ? `${(students / 1000).toFixed(1)}k+ students`
                                            : `${students} students`}
                                    </span>
                                </div>
                                {includesCertificate && (
                                    <div className="flex items-center gap-3">
                                        <Award className="text-accent h-5 w-5" />
                                        <span className="text-sm">
                                            Certificate included
                                        </span>
                                    </div>
                                )}
                            </div>

                            {progress !== undefined && progress > 0 && (
                                <div className="mb-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-foreground text-sm font-semibold">
                                            Progress
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {progress}%
                                        </p>
                                    </div>
                                    <div className="bg-border h-2 overflow-hidden rounded-full">
                                        <div
                                            className="bg-primary h-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {price && (
                                <div className="text-foreground mb-4 text-3xl font-bold">
                                    {price}
                                </div>
                            )}

                            <Button
                                className="mb-3 w-full"
                                onClick={onPrimaryAction}
                            >
                                {primaryActionLabel}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={onSecondaryAction}
                            >
                                {secondaryActionLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
