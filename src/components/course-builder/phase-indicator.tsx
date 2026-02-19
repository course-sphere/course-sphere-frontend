'use client';

import { cn } from '@/lib/utils';
import { Check, BookOpen } from 'lucide-react';
import { Phase, PHASE_ICONS } from './constant';

interface PhaseIndicatorProps {
    phases: Phase[];
    currentPhase: number;
}

export function PhaseIndicator({ phases, currentPhase }: PhaseIndicatorProps) {
    return (
        <div className="mb-8 w-full">
            <div className="flex items-center justify-center gap-0">
                {phases.map((phase, index) => {
                    const isCompleted = currentPhase > phase.id;
                    const isCurrent = currentPhase === phase.id;
                    const Icon = PHASE_ICONS[index] || BookOpen;

                    return (
                        <div key={phase.id} className="flex items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                                        isCompleted
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : isCurrent
                                              ? 'border-primary bg-primary/10 text-primary shadow-primary/20 shadow-md'
                                              : 'border-border bg-card text-muted-foreground',
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <p
                                        className={cn(
                                            'text-sm font-semibold transition-colors',
                                            isCurrent || isCompleted
                                                ? 'text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {phase.title}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {phase.description}
                                    </p>
                                </div>
                            </div>

                            {index < phases.length - 1 && (
                                <div
                                    className={cn(
                                        'mx-6 h-0.5 w-16 transition-colors duration-300',
                                        isCompleted
                                            ? 'bg-primary'
                                            : 'bg-border',
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
