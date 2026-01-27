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
import { Logo } from '@/components/logo';
import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui';

export function MobileHeader({ items }: HeaderProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="lg:hidden">
                    <MenuIcon className="size-4" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>
                        <Logo />
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
                    <SignedOut>
                        <AuthSection />
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            classNames={{
                                content: {
                                    menuItem:
                                        'focus:text-primary focus:bg-primary/10',
                                },
                            }}
                            size="lg"
                            align="end"
                        />
                    </SignedIn>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
