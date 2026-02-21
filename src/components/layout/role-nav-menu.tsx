'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { getMenuByRole, type NavGroup } from '@/config/navigation';
import { Role } from '@/lib/service/user';

interface RoleNavMenuProps {
    role: Role;
}

export function RoleNavMenu({ role }: RoleNavMenuProps) {
    const pathname = usePathname();
    const groups: NavGroup[] = getMenuByRole(role);

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.groupLabel}>
                    <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}
