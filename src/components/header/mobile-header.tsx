import { MenuIcon } from 'lucide-react';
import { HeaderProps } from '.';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { AuthSection } from './auth-section';
import Link from 'next/link';
import { Icon } from '@/components/icon';

export function MobileHeader({ items }: HeaderProps) {
    return (
        <Sheet>
            <div className="hidden space-x-3 md:block">
                <AuthSection />
            </div>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="md:hidden">
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
                    <AuthSection />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
