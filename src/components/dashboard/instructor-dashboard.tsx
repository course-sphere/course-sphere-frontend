'use client';

import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    PlusCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export function InstructorDashboard() {
    const { user } = useAuthStore();
    const instructorName = user?.name || 'Instructor';

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl sm:p-10">
                <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Welcome back, {instructorName}!
                    </h1>
                    <p className="mt-3 max-w-2xl text-lg text-indigo-100">
                        Here is what happening with your courses today. You have
                        students actively learning and new reviews waiting.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-xl bg-white font-bold text-indigo-600 shadow-md hover:bg-slate-100"
                        >
                            <Link href="/course/create">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create New Course
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- 4 CỤC STATS "LÙA GÀ" CHO DEMO --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-muted-foreground text-sm font-medium">
                            Total Students
                        </CardTitle>
                        <div className="rounded-lg bg-blue-500/10 p-2">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-foreground text-3xl font-bold">
                            1,240
                        </div>
                        <p className="mt-1 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="mr-1 h-3 w-3" /> +12% from
                            last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-muted-foreground text-sm font-medium">
                            Active Courses
                        </CardTitle>
                        <div className="rounded-lg bg-indigo-500/10 p-2">
                            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-foreground text-3xl font-bold">
                            5
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                            2 courses in draft
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-muted-foreground text-sm font-medium">
                            Total Earnings
                        </CardTitle>
                        <div className="rounded-lg bg-emerald-500/10 p-2">
                            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-foreground text-3xl font-bold">
                            $12,450
                        </div>
                        <p className="mt-1 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="mr-1 h-3 w-3" /> +$840 this
                            week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-muted-foreground text-sm font-medium">
                            Average Rating
                        </CardTitle>
                        <div className="rounded-lg bg-amber-500/10 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4 text-amber-500"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-foreground text-3xl font-bold">
                            4.8
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Based on 342 reviews
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
