'use client';

import { useState, useEffect } from 'react';
import { Pencil, Check, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InlineArrayEditProps {
    items: string[];
    onSave: (newItems: string[]) => Promise<void>;
    renderItem: (item: string, index: number) => React.ReactNode;
    emptyMessage?: string;
    className?: string;
    listClassName?: string; // 👈 Vũ khí mới để nắn gân giao diện
    label?: string;
}

export function InlineArrayEdit({
    items = [],
    onSave,
    renderItem,
    emptyMessage = 'Click to add items...',
    className = '',
    listClassName, // 👈 Nhận vũ khí
    label,
}: InlineArrayEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentItems, setCurrentItems] = useState<string[]>([...items]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (
            !isEditing &&
            JSON.stringify(items) !== JSON.stringify(currentItems)
        ) {
            setCurrentItems([...(items || [])]);
        }
    }, [items, isEditing, currentItems]);

    const handleSave = async () => {
        const cleanItems = currentItems.filter((i) => i.trim() !== '');

        if (JSON.stringify(cleanItems) === JSON.stringify(items)) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(cleanItems);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setCurrentItems([...items]); // Rollback
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div
                className={`border-primary/30 bg-primary/5 animate-in fade-in zoom-in-95 space-y-4 rounded-2xl border p-5 duration-200 ${className}`}
            >
                {label && (
                    <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </label>
                )}

                <div className="space-y-3">
                    {currentItems.map((item, index) => (
                        <div
                            key={index}
                            className="animate-in slide-in-from-left-2 flex items-center gap-2"
                        >
                            <div className="bg-background border-border text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold">
                                {index + 1}
                            </div>
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newArr = [...currentItems];
                                    newArr[index] = e.target.value;
                                    setCurrentItems(newArr);
                                }}
                                className="bg-background h-10 flex-1 rounded-xl"
                                placeholder="Enter detail..."
                                disabled={isSaving}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setCurrentItems(
                                        currentItems.filter(
                                            (_, i) => i !== index,
                                        ),
                                    )
                                }
                                className="text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0 rounded-xl"
                                disabled={isSaving}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    onClick={() => setCurrentItems([...currentItems, ''])}
                    className="h-10 w-full rounded-xl border-dashed"
                    disabled={isSaving}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>

                <div className="border-primary/10 flex justify-end gap-2 border-t pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setCurrentItems([...items]);
                            setIsEditing(false);
                        }}
                        disabled={isSaving}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-xl bg-green-600 text-white shadow-md hover:bg-green-700"
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

                {items && items.length > 0 ? (
                    <div
                        className={
                            listClassName ||
                            'grid grid-cols-1 gap-4 md:grid-cols-2'
                        }
                    >
                        {items.map((item, idx) => (
                            <div key={idx}>{renderItem(item, idx)}</div>
                        ))}
                    </div>
                ) : (
                    <span className="text-muted-foreground italic">
                        {emptyMessage}
                    </span>
                )}
            </div>
            <div className="bg-primary/10 text-primary absolute top-4 right-4 rounded-lg p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Pencil className="h-4 w-4" />
            </div>
        </div>
    );
}
