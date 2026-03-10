'use client';

import { useState, useEffect } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Option {
    label: string;
    value: string;
}

interface InlineSelectEditProps {
    value: string;
    options: Option[];
    onSave: (newValue: string) => Promise<void>;
    className?: string;
    textClassName?: string;
}

export function InlineSelectEdit({
    value,
    options,
    onSave,
    className = '',
    textClassName = '',
}: InlineSelectEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = async () => {
        if (currentValue === value) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(currentValue);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save select:', error);
            setCurrentValue(value); // Rollback
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    // Tìm label hiển thị cho đẹp (VD: 'beginner' -> 'Beginner')
    const displayLabel =
        options.find((opt) => opt.value === value)?.label || value;

    if (isEditing) {
        return (
            <div
                className={`animate-in fade-in zoom-in-95 flex items-center gap-2 duration-200 ${className}`}
            >
                {/* Dùng thẻ select native của HTML bọc Tailwind cho nhẹ, đỡ lỗi Ref của Shadcn */}
                <select
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    disabled={isSaving}
                    className="border-input bg-background focus-visible:ring-ring text-foreground h-9 w-35 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <Button
                    size="icon"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-9 w-9 bg-green-600 text-white hover:bg-green-700"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Check className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-background/50 hover:bg-background text-foreground h-9 w-9"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            className={`group relative -ml-2 flex cursor-pointer items-center gap-2 rounded-lg border border-transparent p-1 px-2 transition-all hover:border-white/20 hover:bg-white/10 ${className}`}
            onClick={() => setIsEditing(true)}
        >
            <span className={textClassName}>{displayLabel}</span>
            <div className="rounded-md bg-white/20 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Pencil className="h-3 w-3" />
            </div>
        </div>
    );
}
