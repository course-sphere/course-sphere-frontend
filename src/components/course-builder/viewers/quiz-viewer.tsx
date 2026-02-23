'use client';

import React, { useState, useMemo } from 'react';
import { LearnMaterialContent } from '@/lib/service/lesson';
import { Button } from '@/components/ui/button';
import {
    Clock,
    Trophy,
    PlayCircle,
    CheckCircle2,
    XCircle,
    AlertCircle,
    HelpCircle,
    ArrowRight,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizViewerProps {
    material: LearnMaterialContent;
    onSuccess?: () => void;
}

export function QuizViewer({ material, onSuccess }: QuizViewerProps) {
    const data = material.quiz_data;

    // Các màn hình: 'intro' (Giới thiệu) -> 'playing' (Đang làm) -> 'result' (Kết quả)
    const [step, setStep] = useState<'intro' | 'playing' | 'result'>('intro');

    // Lưu trữ đáp án user chọn: { [questionId]: array of answerIds }
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<string, string[]>
    >({});

    // Lưu kết quả chấm điểm
    const [scoreData, setScoreData] = useState({
        earned: 0,
        max: 0,
        percentage: 0,
        passed: false,
    });

    if (!data || !data.questions) {
        return (
            <div className="text-muted-foreground p-8 text-center">
                Quiz data is missing.
            </div>
        );
    }

    const totalQuestions = data.questions.length;

    // --- LOGIC: CHỌN ĐÁP ÁN ---
    const handleToggleAnswer = (
        questionId: string,
        answerId: string,
        type: string,
    ) => {
        if (step === 'result') return; // Không cho sửa khi đã nộp

        setSelectedAnswers((prev) => {
            const current = prev[questionId] || [];
            if (type === 'multiple') {
                // Toggle chọn/bỏ chọn cho multiple choice
                if (current.includes(answerId)) {
                    return {
                        ...prev,
                        [questionId]: current.filter((id) => id !== answerId),
                    };
                }
                return { ...prev, [questionId]: [...current, answerId] };
            } else {
                // Single / True_False thì ghi đè
                return { ...prev, [questionId]: [answerId] };
            }
        });
    };

    // --- LOGIC: CHẤM BÀI ---
    const handleSubmit = () => {
        if (confirm('Are you sure you want to submit your answers?')) {
            let earned = 0;
            let max = 0;

            data.questions.forEach((q) => {
                max += q.score;
                // Lấy mảng ID đáp án đúng
                const correctIds = q.answers
                    .filter((a) => a.is_correct)
                    .map((a) => a.id)
                    .sort();
                // Lấy mảng ID user chọn
                const userIds = (selectedAnswers[q.id] || []).sort();

                // So sánh mảng (user phải chọn đúng VÀ đủ thì mới có điểm)
                if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
                    earned += q.score;
                }
            });

            const percentage = Math.round((earned / max) * 100);
            const passed = percentage >= data.passing_score;

            setScoreData({ earned, max, percentage, passed });
            setStep('result');

            if (passed) {
                onSuccess?.(); // Báo lên page là pass để hiện nút Next Lesson
            }
        }
    };

    const handleRetry = () => {
        setSelectedAnswers({});
        setStep('playing');
    };

    // ==========================================
    // MÀN HÌNH 1: INTRO SCREEN
    // ==========================================
    if (step === 'intro') {
        return (
            <div className="mx-auto mt-4 w-full max-w-3xl">
                <div className="bg-card border-border/60 rounded-2xl border p-8 text-center shadow-sm sm:p-12">
                    <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                        <HelpCircle className="text-primary h-10 w-10" />
                    </div>
                    <h2 className="mb-4 text-2xl font-bold">
                        Ready to test your knowledge?
                    </h2>

                    {data.description && (
                        <div
                            className="prose prose-sm dark:prose-invert text-muted-foreground mx-auto mb-8"
                            dangerouslySetInnerHTML={{
                                __html: data.description,
                            }}
                        />
                    )}

                    <div className="mx-auto mb-10 grid max-w-lg grid-cols-3 gap-4">
                        <div className="bg-muted/30 border-border/50 rounded-xl border p-4">
                            <Clock className="mx-auto mb-2 h-5 w-5 text-blue-500" />
                            <div className="text-muted-foreground text-xs font-semibold uppercase">
                                Time Limit
                            </div>
                            <div className="font-bold">
                                {data.time_limit_minutes} mins
                            </div>
                        </div>
                        <div className="bg-muted/30 border-border/50 rounded-xl border p-4">
                            <AlertCircle className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                            <div className="text-muted-foreground text-xs font-semibold uppercase">
                                Questions
                            </div>
                            <div className="font-bold">{totalQuestions}</div>
                        </div>
                        <div className="bg-muted/30 border-border/50 rounded-xl border p-4">
                            <Trophy className="mx-auto mb-2 h-5 w-5 text-emerald-500" />
                            <div className="text-muted-foreground text-xs font-semibold uppercase">
                                To Pass
                            </div>
                            <div className="font-bold">
                                {data.passing_score}%
                            </div>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => setStep('playing')}
                        className="h-14 rounded-xl px-10 text-lg shadow-md"
                    >
                        <PlayCircle className="mr-2 h-5 w-5" /> Start Quiz
                    </Button>
                </div>
            </div>
        );
    }

    // ==========================================
    // MÀN HÌNH 2 & 3: PLAYING & RESULT SCREEN
    // ==========================================
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {/* Thanh trạng thái kết quả (Chỉ hiện khi đã nộp) */}
            {step === 'result' && (
                <div
                    className={cn(
                        'flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 shadow-sm sm:flex-row',
                        scoreData.passed
                            ? 'border-emerald-500/20 bg-emerald-500/10'
                            : 'border-rose-500/20 bg-rose-500/10',
                    )}
                >
                    <div className="flex items-center gap-4">
                        {scoreData.passed ? (
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-rose-500" />
                        )}
                        <div>
                            <h2 className="text-foreground text-xl font-bold">
                                {scoreData.passed
                                    ? 'Congratulations! You passed.'
                                    : 'You did not pass this time.'}
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
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
                                ({scoreData.earned}/{scoreData.max} points).
                                {scoreData.passed
                                    ? ' Great job!'
                                    : ` You need ${data.passing_score}% to pass.`}
                            </p>
                        </div>
                    </div>
                    {!scoreData.passed && (
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

            {/* Danh sách câu hỏi */}
            <div className="space-y-6">
                {data.questions.map((q, index) => {
                    const userSelected = selectedAnswers[q.id] || [];
                    const isMultiple = q.question_type === 'multiple';

                    return (
                        <div
                            key={q.id}
                            className="bg-card border-border/60 rounded-2xl border p-6 shadow-sm sm:p-8"
                        >
                            {/* Tiêu đề câu hỏi */}
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

                            {/* Danh sách đáp án */}
                            <div className="space-y-3">
                                {q.answers.map((a) => {
                                    const isSelected = userSelected.includes(
                                        a.id,
                                    );

                                    // Logic tô màu khi hiển thị kết quả
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
                                            {/* Giả lập Radio/Checkbox UI */}
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
                                                        : '', // Ẩn nút radio khi có kết quả
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

                            {/* Giải thích (Chỉ hiện khi đã nộp bài VÀ có explanation) */}
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

            {/* Nút nộp bài */}
            {step === 'playing' && (
                <div className="mt-4 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        className="h-14 rounded-xl px-10 text-lg shadow-md"
                        disabled={
                            Object.keys(selectedAnswers).length < totalQuestions
                        } // Bắt buộc chọn hết mới cho nộp
                    >
                        Submit Quiz <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
