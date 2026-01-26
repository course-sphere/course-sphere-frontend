'use client';

import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
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

export function Header({ items }: HeaderProps) {
    const [open, setOpen] = useState(false);

    return (
        <header
            className={cn(
                'sticky top-5 z-50',
                'mx-auto w-full max-w-3xl rounded-lg border shadow-lg',
                'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur',
            )}
        >
            <NavigationMenu className="w-full max-w-full justify-between p-2">
                <div className="hover:bg-accent flex cursor-pointer rounded-md px-2 py-1 duration-100">
                    <Icon />
                </div>
                <NavigationMenuList className="hidden items-center gap-1 md:flex">
                    {items.map((item) => (
                        <NavigationMenuLink
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
                <div className="flex items-center gap-2">
                    <Button size="sm">Login</Button>
                    <Button size="sm" variant="secondary">
                        Register
                    </Button>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setOpen(!open)}
                            className="md:hidden"
                        >
                            <MenuIcon className="size-4" />
                        </Button>
                        <SheetContent
                            className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
                            side="left"
                        >
                            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                                {items.map((item) => (
                                    <Link
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
                                <Button variant="outline">Sign In</Button>
                                <Button>Get Started</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </NavigationMenu>
        </header>
    );
}
