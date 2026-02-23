'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm?: () => void | Promise<void>;
    confirmHref?: string;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive,
    loading,
    onConfirm,
    confirmHref,
}: ConfirmDialogProps) {
    const ActionBtn = (
        <AlertDialogAction
            disabled={loading}
            className={cn(
                'rounded-xl',
                destructive
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            onClick={confirmHref ? undefined : onConfirm}
        >
            {loading ? 'Processing...' : confirmText}
        </AlertDialogAction>
    );

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="border-border bg-card rounded-2xl shadow-lg sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground text-xl font-bold">
                        {title}
                    </AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription className="text-muted-foreground mt-2">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
                    <AlertDialogCancel
                        disabled={loading}
                        className="border-border hover:bg-muted rounded-xl"
                    >
                        {cancelText}
                    </AlertDialogCancel>

                    {confirmHref ? (
                        <Link href={confirmHref} className="w-full sm:w-auto">
                            {ActionBtn}
                        </Link>
                    ) : (
                        ActionBtn
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
