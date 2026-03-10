'use client';

import { useState, useEffect } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

interface InlineRichTextEditProps {
    value: string;
    label?: string;
    placeholder?: string;
    onSave: (newValue: string) => Promise<void>;
    className?: string;
}

export function InlineRichTextEdit({
    value,
    label,
    placeholder,
    onSave,
    className = '',
}: InlineRichTextEditProps) {
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
            console.error('Failed to save rich text:', error);
            setCurrentValue(value);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div
                className={`space-y-3 ${className} animate-in fade-in zoom-in-95 duration-200`}
            >
                {label && (
                    <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </label>
                )}

                <div className="border-border overflow-hidden rounded-xl border shadow-sm">
                    <MinimalTiptapEditor
                        value={currentValue}
                        onChange={(val) => setCurrentValue(val as string)}
                        className="w-full border-0 focus-within:ring-0"
                        editorContentClassName="p-5 min-h-[250px] prose dark:prose-invert max-w-none"
                        output="html"
                        placeholder={
                            placeholder || 'Add detailed description...'
                        }
                        autofocus={true}
                        editable={!isSaving}
                        editorClassName="focus:outline-none"
                    />
                </div>

                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-xl"
                    >
                        <X className="text-muted-foreground mr-2 h-4 w-4" />{' '}
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-xl bg-green-600 text-white hover:bg-green-700"
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`group hover:bg-muted/30 hover:border-border relative -ml-4 cursor-pointer rounded-xl border border-transparent p-4 transition-all ${className}`}
            onClick={() => setIsEditing(true)}
        >
            <div className="flex-1">
                {label && (
                    <label className="text-muted-foreground mb-3 block text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </label>
                )}

                {value && value !== '<p></p>' ? (
                    <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: value }}
                    />
                ) : (
                    <span className="text-muted-foreground italic">
                        {placeholder || 'Click to add content...'}
                    </span>
                )}
            </div>

            <div className="bg-primary/10 text-primary absolute top-4 right-4 rounded-lg p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Pencil className="h-4 w-4" />
            </div>
        </div>
    );
}
