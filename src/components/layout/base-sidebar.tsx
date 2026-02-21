'use client';

import React from 'react';
import Link from 'next/link';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { User } from '@/lib/stores/use-auth-store';

interface BaseResizableSidebarProps {
    children: React.ReactNode;
    user: User | null;
}

export function BaseResizableSidebar({
    children,
    user,
}: BaseResizableSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <span className="text-sm font-bold">
                                        CS
                                    </span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-base font-semibold">
                                        Course Sphere
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>{children}</SidebarContent>

            {user && (
                <SidebarFooter>
                    <NavUser
                        user={{
                            name: user.name,
                            email: user.email,
                            avatar: user.image || undefined,
                        }}
                    />
                </SidebarFooter>
            )}

            <SidebarRail />
        </Sidebar>
    );
}
