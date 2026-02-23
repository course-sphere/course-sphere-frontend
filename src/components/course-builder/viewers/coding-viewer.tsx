'use client';

import { useState } from 'react';
import { LearnMaterialContent } from '@/lib/service/lesson';
import { Button } from '@/components/ui/button';
import { RotateCcw, Code2, Send, CheckCircle2 } from 'lucide-react';
import { CodeEditor } from '@/components/ui/code-editor';

interface CodingViewerProps {
    material: LearnMaterialContent;
    onSuccess?: () => void;
}

export function CodingViewer({ material, onSuccess }: CodingViewerProps) {
    const data = material.coding_data;

    const [currentCode, setCurrentCode] = useState(data?.starter_code || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(material.is_completed);

    if (!data)
        return (
            <div className="text-muted-foreground p-8 text-center">
                Coding data is missing.
            </div>
        );

    const handleReset = () => {
        if (
            confirm(
                'Are you sure you want to reset your code? All your current changes will be lost.',
            )
        ) {
            setCurrentCode(data.starter_code);
        }
    };
    // submit code and mark as done
    const handleSubmit = async () => {
        setIsSubmitting(true);

        // POST /api/learn/materials/coding/{id}/submit kèm theo payload { code: currentCode }
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        onSuccess?.();
    };

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
                        onClick={handleReset}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/40 h-8 px-2 text-xs"
                        disabled={isSubmitted || isSubmitting}
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
                        readOnly={isSubmitted || isSubmitting}
                    />
                </div>

                <div className="bg-card border-border/60 mt-4 flex items-center justify-between rounded-xl border p-4 shadow-sm">
                    <div className="flex-1">
                        {isSubmitted ? (
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
                        disabled={
                            isSubmitting || isSubmitted || !currentCode.trim()
                        }
                        className="min-w-35 rounded-xl shadow-md"
                    >
                        {isSubmitting ? (
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
        </div>
    );
}
