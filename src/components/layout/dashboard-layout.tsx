'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BaseResizableSidebar } from './base-sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarContent: React.ReactNode;
    title?: string;
}

export function DashboardLayout({
    children,
    sidebarContent,
    title = 'Dashboard',
}: DashboardLayoutProps) {
    const { user } = useAuthStore();

    return (
        <SidebarProvider>
            <BaseResizableSidebar user={user}>
                {sidebarContent}
            </BaseResizableSidebar>

            <main className="bg-background relative flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 backdrop-blur sm:px-6">
                    <SidebarTrigger className="-ml-2" />
                    <h1 className="text-lg font-semibold">{title}</h1>
                </header>

                <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </SidebarProvider>
    );
}
