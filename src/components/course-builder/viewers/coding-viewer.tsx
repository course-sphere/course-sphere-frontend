'use client';

import { useState } from 'react';
import { LearnMaterialContent } from '@/lib/service/lesson';
import { Button } from '@/components/ui/button';
import { RotateCcw, Code2, Send, CheckCircle2, Eye } from 'lucide-react';
import { CodeEditor } from '@/components/ui/code-editor';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface CodingViewerProps {
    material: LearnMaterialContent;
    onSuccess?: (code?: string) => Promise<void> | void;
    isPreview?: boolean;
}

export function CodingViewer({
    material,
    onSuccess,
    isPreview = false,
}: CodingViewerProps) {
    const data = material.coding_data;

    const [currentCode, setCurrentCode] = useState(data?.starter_code || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(material.is_completed);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    if (!data)
        return (
            <div className="text-muted-foreground p-8 text-center">
                Coding data is missing.
            </div>
        );

    const handleResetClick = () => {
        setIsResetDialogOpen(true);
    };

    const executeReset = () => {
        setCurrentCode(data.starter_code);
        setIsResetDialogOpen(false);
    };

    // submit code and mark as done
    const handleSubmit = async () => {
        setIsSubmitting(true);

        await onSuccess?.(currentCode);

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const isSubmitDisabled =
        isPreview || isSubmitting || isSubmitted || !currentCode.trim();

    return (
        <div className="mx-auto flex w-full flex-col items-start gap-6 lg:flex-row">
            <div className="flex w-full flex-col lg:sticky lg:top-24 lg:w-4/12">
                <div className="mb-3 flex h-8 items-center px-1">
                    <span className="text-muted-foreground text-sm font-medium">
                        Problem Description
                    </span>
                </div>

                <div className="bg-card border-border/60 rounded-xl border p-6 shadow-sm">
                    <div className="text-foreground border-border/50 mb-6 flex items-center gap-2 border-b pb-4 font-semibold">
                        <Code2 className="text-primary h-5 w-5" />
                        <h3 className="text-lg tracking-tight">
                            Assignment Brief
                        </h3>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 border-border/50 flex flex-col rounded-xl border p-4">
                            <span className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
                                Language
                            </span>
                            <span className="text-foreground font-mono text-sm">
                                {data.language}
                            </span>
                        </div>
                        <div className="bg-muted/30 border-border/50 flex flex-col rounded-xl border p-4">
                            <span className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
                                Max Score
                            </span>
                            <span className="text-foreground text-sm font-semibold">
                                {data.max_score} Points
                            </span>
                        </div>
                    </div>

                    <div
                        className="prose prose-sm dark:prose-invert prose-headings:font-semibold prose-p:text-muted-foreground prose-p:leading-relaxed prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded prose-pre:bg-muted/50 prose-pre:text-foreground prose-pre:border prose-pre:border-border max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.instructions }}
                    />
                </div>
            </div>

            <div className="flex w-full flex-col lg:w-8/12">
                <div className="mb-3 flex h-8 items-center justify-between px-1">
                    <span className="text-muted-foreground text-sm font-medium">
                        Your Solution
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetClick}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/40 h-8 px-2 text-xs"
                        disabled={isPreview || isSubmitted || isSubmitting}
                    >
                        <RotateCcw className="mr-1.5 h-3 w-3" />
                        Reset Code
                    </Button>
                </div>

                <div className="border-border/60 overflow-hidden rounded-xl border shadow-sm">
                    <CodeEditor
                        language={
                            data.language === 'python'
                                ? 'python'
                                : data.language
                        }
                        value={currentCode}
                        onChange={(val) => setCurrentCode(val || '')}
                        height="550px"
                        readOnly={isPreview || isSubmitted || isSubmitting}
                    />
                </div>

                <div className="bg-card border-border/60 mt-4 flex items-center justify-between rounded-xl border p-4 shadow-sm">
                    <div className="flex-1">
                        {isPreview ? (
                            <span className="text-primary flex items-center gap-2 text-sm font-medium">
                                <Eye className="h-5 w-5" />
                                Preview Mode (Code editing and submission are
                                disabled)
                            </span>
                        ) : isSubmitted ? (
                            <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                <CheckCircle2 className="h-5 w-5" />
                                Submitted for grading
                            </span>
                        ) : (
                            <span className="text-muted-foreground hidden text-sm sm:inline-block">
                                Make sure your code covers all edge cases before
                                submitting.
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className="min-w-35 rounded-xl shadow-md"
                    >
                        {isPreview ? (
                            'Submit (Disabled)'
                        ) : isSubmitting ? (
                            'Submitting...'
                        ) : isSubmitted ? (
                            'Submitted'
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Code
                            </>
                        )}
                    </Button>
                </div>
            </div>
            <ConfirmDialog
                open={isResetDialogOpen}
                onOpenChangeAction={setIsResetDialogOpen}
                title="Reset Code"
                description="Are you sure you want to reset your code? All your current changes will be lost and reverted to the starter code."
                confirmText="Reset"
                destructive={true}
                onConfirmAction={executeReset}
            />
        </div>
    );
}
