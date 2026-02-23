'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldAlert } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseTitle: string;
    onConfirm: (reason: string) => Promise<void>;
}
// TODO: POST reject API
export function RejectCourseDialog({
    open,
    onOpenChange,
    courseTitle,
    onConfirm,
}: Props) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReject = async () => {
        if (!reason.trim()) return;
        setIsSubmitting(true);
        await onConfirm(reason);
        setIsSubmitting(false);
        setReason('');
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-card rounded-2xl border-rose-500/20 shadow-lg sm:max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
                        <ShieldAlert className="h-6 w-6 text-rose-500" />
                    </div>
                    <AlertDialogTitle className="text-center text-xl font-bold">
                        Reject Course
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground mt-2 text-center">
                        You are rejecting <strong>{courseTitle}</strong>. Please
                        provide a clear reason so the instructor can fix the
                        issues.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-4">
                    <Textarea
                        placeholder="E.g., Audio quality in Module 2 is poor..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-background min-h-25 resize-none rounded-xl"
                        disabled={isSubmitting}
                    />
                </div>

                <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="border-border rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={!reason.trim() || isSubmitting}
                        className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Confirm Rejection
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
