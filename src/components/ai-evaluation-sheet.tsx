'use client';

import { AIEvaluationResult } from '@/lib/service/course';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: AIEvaluationResult | null;
    courseTitle: string;
}

export function AIEvaluationSheet({
    open,
    onOpenChange,
    data,
    courseTitle,
}: Props) {
    if (!data) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-md md:max-w-lg">
                <SheetHeader className="border-border bg-muted/20 border-b p-6">
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        <SheetTitle className="text-xl">
                            AI Evaluation Report
                        </SheetTitle>
                    </div>
                    <SheetDescription className="line-clamp-2">
                        Analysis for:{' '}
                        <span className="text-foreground font-semibold">
                            {courseTitle}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8 pb-6">
                        <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider text-indigo-900 uppercase dark:text-indigo-300">
                                    Overall AI Score
                                </h4>
                                <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-400">
                                    Based on content quality and compliance.
                                </p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white shadow-md">
                                {data.score}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-foreground flex items-center gap-2 font-semibold">
                                <ShieldCheck className="h-4 w-4" /> Recommended
                                Action
                            </h4>
                            <div className="flex items-center gap-3">
                                {data.recommendedAction === 'Approve' && (
                                    <Badge className="bg-emerald-500 px-3 py-1 text-sm text-white">
                                        <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                        Approve
                                    </Badge>
                                )}
                                {data.recommendedAction === 'Review' && (
                                    <Badge
                                        variant="outline"
                                        className="border-amber-500 px-3 py-1 text-sm text-amber-600"
                                    >
                                        <AlertTriangle className="mr-2 h-4 w-4" />{' '}
                                        Needs Human Review
                                    </Badge>
                                )}
                                {data.recommendedAction === 'Reject' && (
                                    <Badge
                                        variant="destructive"
                                        className="px-3 py-1 text-sm"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />{' '}
                                        Reject
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-foreground font-semibold">
                                Compliance Check
                            </h4>
                            {data.compliancePassed ? (
                                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                    <p>
                                        No policy violations detected. Content
                                        complies with community guidelines.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10">
                                    <XCircle className="h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="font-semibold">
                                            Policy violations detected:
                                        </p>
                                        <ul className="mt-1 list-disc space-y-1 pl-5">
                                            {data.policyFlags.map((flag, i) => (
                                                <li key={i}>{flag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-foreground font-semibold">
                                Content Quality Analysis
                            </h4>
                            <p className="text-muted-foreground bg-muted/30 border-border/50 rounded-xl border p-4 text-sm leading-relaxed">
                                {data.qualityAnalysis}
                            </p>
                        </div>
                    </div>
                </ScrollArea>

                <div className="border-border bg-background border-t p-4">
                    <Button
                        className="w-full rounded-xl"
                        onClick={() => onOpenChange(false)}
                    >
                        Close Report
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
