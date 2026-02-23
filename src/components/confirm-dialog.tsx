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
    onOpenChangeAction: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirmAction?: () => void | Promise<void>;
    confirmHref?: string;
};

export function ConfirmDialog({
    open,
    onOpenChangeAction,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive,
    loading,
    onConfirmAction,
    confirmHref,
}: ConfirmDialogProps) {
    const ActionBtn = (
        <AlertDialogAction
            disabled={loading}
            className={cn(
                'rounded-xl border-none px-6 font-medium shadow-sm transition-all',
                destructive
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            onClick={confirmHref ? undefined : onConfirmAction}
        >
            {loading ? 'Processing...' : confirmText}
        </AlertDialogAction>
    );
    return (
        <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
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
                <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 sm:space-x-0">
                    <AlertDialogCancel
                        disabled={loading}
                        className="border-border rounded-xl font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 sm:mt-0 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                    >
                        {cancelText}
                    </AlertDialogCancel>{' '}
                    {confirmHref ? (
                        <Link href={confirmHref} className="w-full sm:w-auto">
                            {ActionBtn}
                        </Link>
                    ) : (
                        ActionBtn
                    )}
                </AlertDialogFooter>{' '}
            </AlertDialogContent>
        </AlertDialog>
    );
}
