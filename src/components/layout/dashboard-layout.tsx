'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BaseResizableSidebar } from './base-sidebar';
import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui';
import { AuthSection } from '@/components/header/auth-section';

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
    return (
        <SidebarProvider>
            <BaseResizableSidebar>{sidebarContent}</BaseResizableSidebar>

            <main className="bg-background relative flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="-ml-2" />
                        <h1 className="text-lg font-semibold">{title}</h1>
                    </div>

                    <div className="flex items-center">
                        <SignedOut>
                            <AuthSection />
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                className="size-8"
                                classNames={{
                                    content: {
                                        menuItem:
                                            'focus:text-primary focus:bg-primary/10',
                                    },
                                }}
                                size="icon"
                                align="end"
                            />
                        </SignedIn>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </SidebarProvider>
    );
}
