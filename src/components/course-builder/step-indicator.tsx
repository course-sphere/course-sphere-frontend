'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Step } from './constant';

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export function StepIndicator({
    steps,
    currentStep,
    onStepClick,
}: StepIndicatorProps) {
    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isClickable =
                        onStepClick && (isCompleted || isCurrent);

                    return (
                        <li key={step.id} className="relative flex-1">
                            <div
                                className={cn(
                                    'flex flex-col items-center',
                                    isClickable && 'cursor-pointer',
                                )}
                                onClick={() =>
                                    isClickable && onStepClick?.(step.id)
                                }
                            >
                                {index !== 0 && (
                                    <div
                                        className={cn(
                                            'absolute top-5 right-1/2 left-0 h-0.5 -translate-y-1/2',
                                            isCompleted || isCurrent
                                                ? 'bg-primary'
                                                : 'bg-border',
                                        )}
                                    />
                                )}
                                {index !== steps.length - 1 && (
                                    <div
                                        className={cn(
                                            'absolute top-5 right-0 left-1/2 h-0.5 -translate-y-1/2',
                                            isCompleted
                                                ? 'bg-primary'
                                                : 'bg-border',
                                        )}
                                    />
                                )}

                                <div
                                    className={cn(
                                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                                        isCompleted
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : isCurrent
                                              ? 'border-primary bg-primary text-primary-foreground shadow-primary/30 shadow-lg'
                                              : 'border-border bg-card text-muted-foreground',
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">
                                            {step.id}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 text-center">
                                    <p
                                        className={cn(
                                            'text-sm font-medium transition-colors',
                                            isCurrent || isCompleted
                                                ? 'text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 hidden text-xs sm:block">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
