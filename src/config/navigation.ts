import { Role } from '@/lib/service/user';
import {
    type LucideIcon,
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Users,
    Wallet,
    Settings,
    FileCheck,
    AlertTriangle,
    CreditCard,
    BarChart3,
    Trophy,
} from 'lucide-react';

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface NavGroup {
    groupLabel: string;
    items: NavItem[];
}

export const STUDENT_MENU: NavGroup[] = [
    {
        groupLabel: 'Learning',
        items: [
            { title: 'My Courses', href: '/course', icon: BookOpen },
            { title: 'Achievements', href: '/achievements', icon: Trophy },
        ],
    },
    {
        groupLabel: 'Account',
        items: [{ title: 'Settings', href: '/account', icon: Settings }],
    },
];

export const INSTRUCTOR_MENU: NavGroup[] = [
    {
        groupLabel: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/teacher/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        groupLabel: 'Course Management',
        items: [
            {
                title: 'My Courses',
                href: '/course',
                icon: BookOpen,
            },
            {
                title: 'Create Course',
                href: '/course/create',
                icon: PlusCircle,
            },
        ],
    },
    {
        groupLabel: 'Community',
        items: [
            {
                title: 'Students',
                href: '/teacher/students',
                icon: Users,
            },
            {
                title: 'Earnings',
                href: '/teacher/earnings',
                icon: Wallet,
            },
        ],
    },
    {
        groupLabel: 'Account',
        items: [
            {
                title: 'Settings',
                href: '/account',
                icon: Settings,
            },
        ],
    },
];

export const ADMIN_MENU: NavGroup[] = [
    {
        groupLabel: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
            },
            {
                title: 'Statistics',
                href: '/admin/statistics',
                icon: BarChart3,
            },
        ],
    },
    {
        groupLabel: 'Content Governance',
        items: [
            {
                title: 'Course Approvals',
                href: '/admin/approvals',
                icon: FileCheck,
            },
            {
                title: 'Reports',
                href: '/admin/reports',
                icon: AlertTriangle,
            },
        ],
    },
    {
        groupLabel: 'Finance',
        items: [
            {
                title: 'Withdrawals',
                href: '/admin/withdrawals',
                icon: CreditCard,
            },
        ],
    },
    {
        groupLabel: 'People',
        items: [
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            },
        ],
    },
    {
        groupLabel: 'Account',
        items: [
            {
                title: 'Settings',
                href: '/admin/settings',
                icon: Settings,
            },
        ],
    },
];

export function getMenuByRole(role: Role): NavGroup[] {
    switch (role) {
        case 'instructor':
            return INSTRUCTOR_MENU;
        case 'admin':
            return ADMIN_MENU;
        case 'student':
            return STUDENT_MENU;
        default:
            return [];
    }
}
