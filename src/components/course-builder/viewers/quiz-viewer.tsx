'use client';

import { useState, useEffect } from 'react';
import { LearnMaterialContent } from '@/lib/service/lesson';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    HelpCircle,
    ArrowRight,
    RotateCcw,
    Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizViewerProps {
    material: LearnMaterialContent;
    onSuccess?: () => void;
    isPreview?: boolean;
}

export function QuizViewer({
    material,
    onSuccess,
    isPreview = false,
}: QuizViewerProps) {
    const data = material.quiz_data;

    const [step, setStep] = useState<'intro' | 'playing' | 'result'>(
        isPreview ? 'result' : 'intro',
    );

    // user answers
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<string, string[]>
    >({});

    // score state
    const [scoreData, setScoreData] = useState({
        earned: 0,
        max: 0,
        percentage: 0,
        passed: false,
    });

    useEffect(() => {
        if (isPreview && data?.questions) {
            const correctAnswersMap: Record<string, string[]> = {};
            let totalMaxScore = 0;

            data.questions.forEach((q) => {
                totalMaxScore += q.score;
                correctAnswersMap[q.id] = q.answers
                    .filter((a) => a.is_correct)
                    .map((a) => a.id);
            });

            setSelectedAnswers(correctAnswersMap);
            setScoreData({
                earned: totalMaxScore,
                max: totalMaxScore,
                percentage: 100,
                passed: true,
            });
            setStep('result');
        }
    }, [isPreview, data]);

    if (!data || !data.questions) {
        return (
            <div className="text-muted-foreground p-8 text-center">
                Quiz data is missing.
            </div>
        );
    }

    const totalQuestions = data.questions.length;

    const handleToggleAnswer = (
        questionId: string,
        answerId: string,
        type: string,
    ) => {
        if (step === 'result' || isPreview) return;

        setSelectedAnswers((prev) => {
            const current = prev[questionId] || [];
            if (type === 'multiple') {
                if (current.includes(answerId)) {
                    return {
                        ...prev,
                        [questionId]: current.filter((id) => id !== answerId),
                    };
                }
                return { ...prev, [questionId]: [...current, answerId] };
            } else {
                return { ...prev, [questionId]: [answerId] };
            }
        });
    };

    // get results in frontend
    const handleSubmit = () => {
        if (confirm('Are you sure you want to submit your answers?')) {
            let earned = 0;
            let max = 0;

            data.questions.forEach((q) => {
                max += q.score;
                // correct ans
                const correctIds = q.answers
                    .filter((a) => a.is_correct)
                    .map((a) => a.id)
                    .sort();
                // user ans
                const userIds = (selectedAnswers[q.id] || []).sort();

                // compared and calculate points
                if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
                    earned += q.score;
                }
            });

            const percentage = Math.round((earned / max) * 100);
            const passed = percentage >= data.passing_score;

            setScoreData({ earned, max, percentage, passed });
            setStep('result');

            if (passed) {
                onSuccess?.();
            }
        }
    };

    const handleRetry = () => {
        if (isPreview) return;
        setSelectedAnswers({});
        setStep('playing');
    };

    if (step === 'intro' && !isPreview) {
        return (
            <div className="mx-auto mt-4 w-full max-w-2xl">
                <div className="bg-card border-border/60 rounded-2xl border p-8 shadow-sm sm:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
                            Final Assessment
                        </h2>
                        <p className="text-muted-foreground">
                            Please review the instructions carefully before
                            starting.
                        </p>
                    </div>

                    {data.description && data.description !== '<p></p>' && (
                        <div className="bg-muted/20 border-border/40 mb-8 rounded-xl border p-6">
                            <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                                Instructions
                            </h3>
                            <div
                                className="prose prose-sm dark:prose-invert text-foreground prose-p:leading-relaxed max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: data.description,
                                }}
                            />
                        </div>
                    )}

                    <div className="border-border/50 mb-10 grid grid-cols-3 gap-4 border-t pt-8">
                        <div className="flex flex-col items-center justify-center p-2">
                            <span className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
                                Time Limit
                            </span>
                            <span className="text-foreground text-xl font-bold">
                                {data.time_limit_minutes}{' '}
                                <span className="text-muted-foreground text-sm font-medium">
                                    min
                                </span>
                            </span>
                        </div>

                        <div className="border-border/50 flex flex-col items-center justify-center border-x p-2">
                            <span className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
                                Questions
                            </span>
                            <span className="text-foreground text-xl font-bold">
                                {totalQuestions}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2">
                            <span className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
                                Passing Score
                            </span>
                            <span className="text-foreground text-xl font-bold">
                                {data.passing_score}%
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={() => setStep('playing')}
                            className="h-14 min-w-50 rounded-xl px-10 text-lg font-semibold shadow-md transition-all hover:-translate-y-1"
                        >
                            Begin Quiz
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {step === 'result' && (
                <div
                    className={cn(
                        'flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 shadow-sm sm:flex-row',
                        isPreview
                            ? 'border-amber-500/20 bg-amber-500/10'
                            : scoreData.passed
                              ? 'border-emerald-500/20 bg-emerald-500/10'
                              : 'border-rose-500/20 bg-rose-500/10',
                    )}
                >
                    <div className="flex items-center gap-4">
                        {isPreview ? (
                            <Eye className="h-12 w-12 text-amber-500" />
                        ) : scoreData.passed ? (
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-rose-500" />
                        )}
                        <div>
                            <h2 className="text-foreground text-xl font-bold">
                                {isPreview
                                    ? 'Instructor Preview Mode'
                                    : scoreData.passed
                                      ? 'Congratulations! You passed.'
                                      : 'You did not pass this time.'}
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {isPreview ? (
                                    'This is how students will see the correct answers and explanations after passing.'
                                ) : (
                                    <>
                                        You scored{' '}
                                        <strong
                                            className={
                                                scoreData.passed
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }
                                        >
                                            {scoreData.percentage}%
                                        </strong>{' '}
                                        ({scoreData.earned}/{scoreData.max}{' '}
                                        points).
                                        {scoreData.passed
                                            ? ' Great job!'
                                            : ` You need ${data.passing_score}% to pass.`}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    {!scoreData.passed && !isPreview && (
                        <Button
                            onClick={handleRetry}
                            variant="outline"
                            className="bg-background rounded-xl"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    )}
                </div>
            )}

            <div className="space-y-6">
                {data.questions.map((q, index) => {
                    const userSelected = selectedAnswers[q.id] || [];
                    const isMultiple = q.question_type === 'multiple';

                    return (
                        <div
                            key={q.id}
                            className="bg-card border-border/60 rounded-2xl border p-6 shadow-sm sm:p-8"
                        >
                            <div className="mb-6 flex items-start justify-between">
                                <h3 className="text-foreground text-lg font-semibold">
                                    <span className="text-muted-foreground mr-2">
                                        {index + 1}.
                                    </span>
                                    {q.title}
                                </h3>
                                <span className="text-muted-foreground bg-muted/50 rounded px-2 py-1 text-sm font-medium">
                                    {q.score} pts
                                </span>
                            </div>

                            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                                {isMultiple
                                    ? 'Select all that apply'
                                    : 'Select one answer'}
                            </p>

                            <div className="space-y-3">
                                {q.answers.map((a) => {
                                    const isSelected = userSelected.includes(
                                        a.id,
                                    );

                                    let resultStyle =
                                        'hover:bg-muted/50 border-border';
                                    let Icon = null;

                                    if (step === 'result') {
                                        if (a.is_correct) {
                                            resultStyle =
                                                'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400';
                                            Icon = (
                                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                                            );
                                        } else if (
                                            isSelected &&
                                            !a.is_correct
                                        ) {
                                            resultStyle =
                                                'bg-rose-500/10 border-rose-500/50 text-rose-700 dark:text-rose-400';
                                            Icon = (
                                                <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                                            );
                                        } else {
                                            resultStyle =
                                                'opacity-60 border-border';
                                        }
                                    } else if (isSelected) {
                                        resultStyle =
                                            'bg-primary/5 border-primary text-primary';
                                    }

                                    return (
                                        <div
                                            key={a.id}
                                            onClick={() =>
                                                handleToggleAnswer(
                                                    q.id,
                                                    a.id,
                                                    q.question_type,
                                                )
                                            }
                                            className={cn(
                                                'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                                                resultStyle,
                                                step === 'playing'
                                                    ? 'cursor-pointer'
                                                    : 'cursor-default',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-5 w-5 shrink-0 items-center justify-center border',
                                                    isMultiple
                                                        ? 'rounded'
                                                        : 'rounded-full',
                                                    isSelected &&
                                                        step === 'playing'
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-muted-foreground/50',
                                                    step === 'result'
                                                        ? 'hidden'
                                                        : '',
                                                )}
                                            >
                                                {isSelected &&
                                                    step === 'playing' && (
                                                        <div
                                                            className={cn(
                                                                'bg-current',
                                                                isMultiple
                                                                    ? 'h-3 w-3 rounded-sm'
                                                                    : 'h-2.5 w-2.5 rounded-full',
                                                            )}
                                                        />
                                                    )}
                                            </div>

                                            {Icon}
                                            <span className="flex-1 font-medium">
                                                {a.content}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {step === 'result' &&
                                q.explanation &&
                                q.explanation !== '<p></p>' && (
                                    <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                                        <div className="mb-2 flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                                            <HelpCircle className="h-4 w-4" />{' '}
                                            Explanation
                                        </div>
                                        <div
                                            className="prose prose-sm dark:prose-invert prose-p:leading-snug text-blue-900 dark:text-blue-100"
                                            dangerouslySetInnerHTML={{
                                                __html: q.explanation,
                                            }}
                                        />
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>

            {step === 'playing' && (
                <div className="mt-4 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        className="h-14 rounded-xl px-10 text-lg shadow-md"
                        disabled={
                            Object.keys(selectedAnswers).length < totalQuestions
                        }
                    >
                        Submit Quiz <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
