'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export function DashboardHeader({
    title,
    subtitle,
    onMenuClick,
}: DashboardHeaderProps) {
    return (
        <header className="border-border bg-card/80 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 backdrop-blur-md">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
            </Button>

            <div className="flex flex-col">
                <h1 className="text-foreground text-xl font-bold">{title}</h1>
                {subtitle && (
                    <p className="text-muted-foreground text-xs">{subtitle}</p>
                )}
            </div>

            <div className="ml-auto flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:block">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Search courses, lessons..."
                            className="bg-muted/50 focus:border-primary focus:bg-background w-72 rounded-xl border-transparent pl-9 transition-all"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-muted relative rounded-xl"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                                3
                            </span>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-80 rounded-xl"
                    >
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            <Badge variant="secondary" className="text-xs">
                                3 new
                            </Badge>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="focus:bg-muted flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary flex h-2 w-2 rounded-full" />
                                <p className="text-sm font-medium">
                                    New course available
                                </p>
                            </div>
                            <p className="text-muted-foreground pl-4 text-xs">
                                Advanced JavaScript Patterns is now published
                            </p>
                            <p className="text-muted-foreground/70 pl-4 text-xs">
                                2 hours ago
                            </p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-muted flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary flex h-2 w-2 rounded-full" />
                                <p className="text-sm font-medium">
                                    Assignment graded
                                </p>
                            </div>
                            <p className="text-muted-foreground pl-4 text-xs">
                                Your Todo App assignment received 85/100
                            </p>
                            <p className="text-muted-foreground/70 pl-4 text-xs">
                                Yesterday
                            </p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-muted flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                                <p className="text-sm font-medium">
                                    Wallet updated
                                </p>
                            </div>
                            <p className="text-muted-foreground pl-4 text-xs">
                                $200 has been added to your wallet
                            </p>
                            <p className="text-muted-foreground/70 pl-4 text-xs">
                                3 days ago
                            </p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-primary cursor-pointer justify-center font-medium">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
