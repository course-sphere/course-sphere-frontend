'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/service/user';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Wallet,
    Settings,
    Users,
    FileCheck,
    AlertTriangle,
    BarChart3,
    PlusCircle,
    ClipboardList,
    LogOut,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: 'Browse Courses',
        href: '/student/browse',
        icon: <BookOpen className="h-4 w-4" />,
    },
    {
        title: 'My Learning',
        href: '/student/my-learning',
        icon: <GraduationCap className="h-4 w-4" />,
    },
    {
        title: 'Assignments',
        href: '/student/assignments',
        icon: <ClipboardList className="h-4 w-4" />,
    },
    {
        title: 'Wallet',
        href: '/student/wallet',
        icon: <Wallet className="h-4 w-4" />,
    },
];

const teacherNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/teacher/dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: 'My Courses',
        href: '/teacher/courses',
        icon: <BookOpen className="h-4 w-4" />,
    },
    {
        title: 'Create Course',
        href: '/teacher/courses/create',
        icon: <PlusCircle className="h-4 w-4" />,
    },
    {
        title: 'Students',
        href: '/teacher/students',
        icon: <Users className="h-4 w-4" />,
    },
    {
        title: 'Earnings',
        href: '/teacher/earnings',
        icon: <Wallet className="h-4 w-4" />,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: 'Course Approvals',
        href: '/admin/approvals',
        icon: <FileCheck className="h-4 w-4" />,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
        title: 'Withdrawals',
        href: '/admin/withdrawals',
        icon: <CreditCard className="h-4 w-4" />,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: <Users className="h-4 w-4" />,
    },
    {
        title: 'Statistics',
        href: '/admin/statistics',
        icon: <BarChart3 className="h-4 w-4" />,
    },
];

interface SidebarProps {
    role: Role;
    userName?: string;
    userEmail?: string;
}

export function DashboardSidebar({
    role,
    userName = 'User',
    userEmail = 'user@example.com',
}: SidebarProps) {
    const pathname = usePathname();

    const navItems =
        role === 'admin'
            ? adminNavItems
            : role === 'teacher'
              ? teacherNavItems
              : studentNavItems;

    const displayName = userName || 'User';
    const displayEmail = userEmail || 'user@example.com';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <aside className="border-border bg-card fixed top-0 left-0 z-40 h-screen w-64 border-r shadow-sm">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="border-border flex h-16 items-center border-b px-6">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-md transition-transform group-hover:scale-105">
                            <span className="text-primary-foreground text-sm font-bold">
                                LC
                            </span>
                        </div>
                        <span className="text-foreground text-xl font-bold">
                            LearnCo
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    pathname === item.href
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1',
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    <Link
                        href={`/${role}/settings`}
                        className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            pathname === `/${role}/settings`
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1',
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>

                {/* User Info */}
                <div className="border-border border-t p-4">
                    <div className="bg-muted/70 flex items-center gap-3 rounded-xl p-3 backdrop-blur-sm">
                        <div className="from-primary to-primary/80 text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-semibold shadow-sm">
                            {initial}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-foreground truncate text-sm font-semibold">
                                {displayName}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                                {displayEmail}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-3 w-full justify-start gap-2 rounded-xl"
                        asChild
                    >
                        <Link href="/sign-in">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Link>
                    </Button>
                </div>
            </div>
        </aside>
    );
}
