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

export const TEACHER_MENU: NavGroup[] = [
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

export function getMenuByRole(role: 'TEACHER' | 'ADMIN'): NavGroup[] {
    return role === 'TEACHER' ? TEACHER_MENU : ADMIN_MENU;
}
