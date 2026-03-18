'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
    description?: string;
}

interface InlineSelectEditProps {
    value: string;
    options: Option[];
    onSave: (value: string) => void;
    textClassName?: string;
}

export function InlineSelectEdit({
    value,
    options,
    onSave,
    textClassName,
}: InlineSelectEditProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [draftValue, setDraftValue] = useState(value);

    // Re-sync draft when value prop changes (without useEffect)
    if (!isEditing && draftValue !== value) {
        setDraftValue(value);
    }

    const handleSave = () => {
        setIsEditing(false);
        if (draftValue !== value) {
            onSave(draftValue);
        }
    };

    const handleCancel = () => {
        setDraftValue(value);
        setIsEditing(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : value;

    if (isEditing) {
        return (
            <div className="animate-in fade-in zoom-in-95 flex items-center gap-2 duration-200">
                <Select value={draftValue} onValueChange={setDraftValue}>
                    <SelectTrigger className="focus:ring-primary h-9 w-40 border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Select option..." />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-900 text-white">
                        {options.map((opt) => (
                            <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800"
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        className="h-8 w-8 rounded-md text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-md text-slate-400"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group -ml-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-all hover:bg-slate-800/50"
            onClick={() => setIsEditing(true)}
        >
            <span
                className={cn('font-medium transition-colors', textClassName)}
            >
                {displayLabel}
            </span>
            <Pencil className="h-3 w-3 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
