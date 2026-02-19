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
import { FileText, Clock } from 'lucide-react';
import type { CourseModuleFormData } from '@/lib/schemas/course';

interface ReadingEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    basePath: string;
}

export function ReadingEditor({ form, basePath }: ReadingEditorProps) {
    const content =
        (form.watch(`${basePath}.content` as any) as unknown as string) || '';
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const estimatedTime = Math.max(1, Math.round(wordCount / 200)); // ~200 words per minute

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-500">
                <FileText className="h-4 w-4" />
                Reading Material
            </div>

            <FormField
                control={form.control}
                name={`${basePath}.content` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Write your reading material here. You can use markdown for formatting..."
                                className="min-h-48 resize-none rounded-lg font-mono text-sm"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormDescription className="flex items-center justify-between">
                            <span>Supports Markdown formatting</span>
                            <span className="text-xs">
                                {wordCount} words ({estimatedTime} min read)
                            </span>
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`${basePath}.duration` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Estimated Duration (minutes)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder={`Auto-estimated: ${estimatedTime} min`}
                                className="h-10 w-40 rounded-lg"
                                {...field}
                                value={(field.value as number) || estimatedTime}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Markdown Tips */}
            <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground mb-2 text-xs font-medium">
                    Markdown Tips:
                </p>
                <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <code className="bg-muted rounded px-1"># Heading</code>
                    </div>
                    <div>
                        <code className="bg-muted rounded px-1">**bold**</code>
                    </div>
                    <div>
                        <code className="bg-muted rounded px-1">*italic*</code>
                    </div>
                    <div>
                        <code className="bg-muted rounded px-1">`code`</code>
                    </div>
                    <div>
                        <code className="bg-muted rounded px-1">
                            - list item
                        </code>
                    </div>
                    <div>
                        <code className="bg-muted rounded px-1">
                            [link](url)
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
