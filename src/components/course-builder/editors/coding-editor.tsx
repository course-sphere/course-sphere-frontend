'use client';

import { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Code, Trophy, Calendar } from 'lucide-react';
import type { CourseModuleFormData } from '@/lib/schemas/course';

interface CodingEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    basePath: string;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'sql', label: 'SQL' },
];

export function CodingEditor({ form, basePath }: CodingEditorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                <Code className="h-4 w-4" />
                Coding Assignment Settings
            </div>

            <FormField
                control={form.control}
                name={`${basePath}.description` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe what students need to build or solve..."
                                className="min-h-24 resize-none rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`${basePath}.instructions` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Step-by-step instructions for completing this assignment..."
                                className="min-h-32 resize-none rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Be specific about requirements, constraints, and
                            expected output
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`${basePath}.language` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Programming Language</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={(field.value as string) || 'javascript'}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl">
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`${basePath}.max_score` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Trophy className="h-3.5 w-3.5" />
                                Max Score
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="100"
                                    className="h-10 rounded-lg"
                                    {...field}
                                    value={(field.value as number) || 100}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name={`${basePath}.due_days` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Days to Complete
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="7"
                                className="h-10 w-32 rounded-lg"
                                {...field}
                                value={(field.value as number) || 7}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormDescription>
                            Days students have to submit after unlocking
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`${basePath}.starter_code` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Starter Code (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="// Provide starter code template here..."
                                className="min-h-32 resize-none rounded-lg font-mono text-sm"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Code template students will start with
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
