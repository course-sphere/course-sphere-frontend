'use client';

import { useEffect, useRef, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { MobileHeader } from './mobile-header';
import { SearchInput } from './search-input';
import { AuthSection } from './auth-section';
import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui';

export interface HeaderProps {
    items: { label: string; href: string }[];
}

export function Header({ items }: HeaderProps) {
    const [isFloating, setIsFloating] = useState(
        typeof window !== 'undefined' ? window.scrollY > 10 : false,
    );
    const tickingRef = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;
            window.requestAnimationFrame(() => {
                setIsFloating(window.scrollY > 10);
                tickingRef.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`z-50 transition-all duration-200 ${
                isFloating
                    ? 'fixed top-5 left-1/2 w-full -translate-x-1/2 transform px-10'
                    : 'relative top-0 left-0 w-full px-0'
            }`}
        >
            <div
                className={`mx-auto w-full transition-all duration-200 ${isFloating ? 'max-w-6xl rounded-lg border px-6 shadow-lg' : 'max-w-full rounded-none border-0 px-4 shadow-none'} bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur`}
            >
                <NavigationMenu
                    className={cn(
                        'relative mx-auto w-full justify-between p-2',
                        isFloating ? 'max-w-full' : 'max-w-6xl',
                    )}
                >
                    <div className="flex cursor-pointer rounded-md px-2 py-1 duration-100">
                        <Logo className="size-6" />
                        <NavigationMenuList className="hidden items-center gap-1 lg:flex">
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

                    <div className="absolute left-1/2 -translate-x-1/2 transform">
                        <SearchInput isLoading={false} onSearch={console.log} />
                    </div>

                    <div className="hidden space-x-3 lg:block">
                        <SignedOut>
                            <AuthSection />
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                className="size-10"
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
                    <MobileHeader items={items} />
                </NavigationMenu>
            </div>
        </header>
    );
}
