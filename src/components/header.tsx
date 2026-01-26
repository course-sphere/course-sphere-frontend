'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export interface HeaderProps {
    items: { label: string; href: string }[];
}

function Auth() {
    return (
        <>
            <Button size="sm" asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" variant="secondary" asChild>
                <Link href="/auth/register">Register</Link>
            </Button>
        </>
    );
}

export function Header({ items }: HeaderProps) {
    return (
        <header className="sticky top-5 z-50 px-10">
            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 mx-auto w-full max-w-4xl rounded-lg border shadow-lg backdrop-blur">
                <NavigationMenu className="relative w-full max-w-full justify-between p-2">
                    <div className="hover:bg-accent flex cursor-pointer rounded-md px-2 py-1 duration-100">
                        <Icon />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 transform">
                        <NavigationMenuList className="hidden items-center gap-1 md:flex">
                            {items.map((item) => (
                                <NavigationMenuLink
                                    key={item.label}
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                        })}
                                        href={item.href}
                                    >
                                        {item.label}
                                    </Link>
                                </NavigationMenuLink>
                            ))}
                        </NavigationMenuList>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <div className="hidden space-x-3 md:block">
                                <Auth />
                            </div>
                            <SheetTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="md:hidden"
                                >
                                    <MenuIcon className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Icon />
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                                    {items.map((item) => (
                                        <Link
                                            key={item.label}
                                            className={buttonVariants({
                                                variant: 'ghost',
                                                className: 'justify-start',
                                            })}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                                <SheetFooter>
                                    <Auth />
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </NavigationMenu>
            </div>
        </header>
    );
}
