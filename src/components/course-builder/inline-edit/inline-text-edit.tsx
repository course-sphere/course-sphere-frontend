'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface InlineTextEditProps {
    value: string;
    label?: string;
    type?: 'input' | 'textarea';
    placeholder?: string;
    onSave: (newValue: string) => Promise<void>;
    className?: string;
    textClassName?: string;
}

export function InlineTextEdit({
    value,
    label,
    type = 'input',
    placeholder,
    onSave,
    className = '',
    textClassName = '',
}: InlineTextEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = async () => {
        if (currentValue.trim() === value.trim()) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(currentValue); // waiting for tanstack
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save:', error);
            setCurrentValue(value); // rollback
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && type === 'input') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div
                className={`space-y-2 ${className} animate-in fade-in zoom-in-95 duration-200`}
            >
                {label && (
                    <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </label>
                )}
                <div className="flex items-start gap-2">
                    {type === 'input' ? (
                        <Input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isSaving}
                            className="flex-1"
                        />
                    ) : (
                        <Textarea
                            ref={
                                inputRef as React.RefObject<HTMLTextAreaElement>
                            }
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isSaving}
                            className="min-h-24 flex-1 resize-none"
                        />
                    )}
                    <div className="flex flex-col gap-2">
                        <Button
                            size="icon"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-10 w-10 bg-green-600 text-white hover:bg-green-700"
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
                            className="h-10 w-10"
                        >
                            <X className="text-muted-foreground h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`group hover:bg-muted/50 hover:border-border relative -ml-2 flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-2 transition-all ${className}`}
            onClick={() => setIsEditing(true)}
        >
            <div className="flex-1">
                {label && (
                    <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </label>
                )}
                <div className={textClassName}>
                    {value || (
                        <span className="text-muted-foreground italic">
                            {placeholder || 'Add content...'}
                        </span>
                    )}
                </div>
            </div>
            <div className="bg-primary/10 text-primary rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Pencil className="h-4 w-4" />
            </div>
        </div>
    );
}
