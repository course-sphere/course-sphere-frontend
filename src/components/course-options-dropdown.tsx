'use client';

import { useRouter } from 'next/navigation';
import { Share2, Star, CheckCircle, LogOut, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const MiniProgress = ({ progress }: { progress: number }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex h-8 w-8 items-center justify-center">
            <svg className="h-8 w-8 -rotate-90 transform">
                <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-muted/20"
                />
                <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-700 ease-in-out"
                />
            </svg>
        </div>
    );
};

interface CourseOptionsDropdownProps {
    courseId: string;
    progressPercentage: number;
}

export function CourseOptionsDropdown({
    courseId,
    progressPercentage,
}: CourseOptionsDropdownProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 h-9 w-9 rounded-full"
                >
                    <MoreVertical className="text-muted-foreground h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="border-border/50 w-64 rounded-xl p-2 shadow-xl"
            >
                <DropdownMenuLabel className="flex items-center gap-3 py-2">
                    <MiniProgress progress={progressPercentage} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            Course Progress
                        </span>
                        <span className="text-muted-foreground text-xs font-normal">
                            Keep up the good work!
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem className="cursor-pointer py-2.5 transition-colors focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-500/10 dark:focus:text-emerald-400">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                        <span className="font-medium">Mark lesson as done</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2.5 transition-colors focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-500/10 dark:focus:text-blue-400">
                        <Share2 className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="font-medium">Share Course</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2.5 transition-colors focus:bg-amber-50 focus:text-amber-700 dark:focus:bg-amber-500/10 dark:focus:text-amber-400">
                        <Star className="mr-2 h-4 w-4 text-amber-500" />
                        <span className="font-medium">Leave a Review</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => router.push(`/course/${courseId}`)}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2.5 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Exit Course</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
