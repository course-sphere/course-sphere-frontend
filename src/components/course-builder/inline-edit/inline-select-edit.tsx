'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleValueChange = (newValue: string) => {
        setCurrentValue(newValue);
        setIsEditing(false);

        if (newValue !== value) {
            onSave(newValue);
        }
    };

    const selectedOption = options.find((opt) => opt.value === currentValue);
    const displayLabel = selectedOption ? selectedOption.label : currentValue;

    if (isEditing) {
        return (
            <div className="animate-in fade-in zoom-in-95 flex items-center gap-2 duration-200">
                <Select
                    value={currentValue}
                    onValueChange={handleValueChange}
                    open={isEditing}
                    onOpenChange={setIsEditing}
                >
                    <SelectTrigger className="focus:ring-primary h-8 w-40 border-slate-700 bg-slate-900 text-white">
                        <SelectValue placeholder="Select level" />
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
