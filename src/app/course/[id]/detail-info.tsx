import { Card } from '@/components/ui/card';
import React from 'react';

interface DetailInfoProps {
    type: 'course' | 'learning-path';
    items: {
        label: string;
        value: React.ReactNode;
        icon?: React.ReactNode;
    }[];
}

export function DetailInfo({ type, items }: DetailInfoProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-foreground mb-8 text-3xl font-bold tracking-tight">
                {type === 'course' ? 'About This Course' : 'About This Path'}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item, index) => (
                    <Card
                        key={index}
                        className="border-border hover:border-accent/50 border p-6 transition-colors"
                    >
                        <div className="mb-3 flex items-start gap-3">
                            {item.icon && (
                                <div className="text-accent">{item.icon}</div>
                            )}
                            <p className="text-muted-foreground text-sm font-medium">
                                {item.label}
                            </p>
                        </div>
                        <p className="text-foreground text-lg font-semibold">
                            {item.value}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
