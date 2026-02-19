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
import { Video, Clock, Link as LinkIcon, Upload } from 'lucide-react';
import type { CourseModuleFormData } from '@/lib/schemas/course';

interface VideoEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    basePath: string;
}

export function VideoEditor({ form, basePath }: VideoEditorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                <Video className="h-4 w-4" />
                Video Settings
            </div>

            <FormField
                control={form.control}
                name={`${basePath}.video_url` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5" />
                            Video URL
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="https://youtube.com/watch?v=... or direct video URL"
                                className="h-10 rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Supports YouTube, Vimeo, or direct video links
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
                            Duration (minutes)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="e.g., 15"
                                className="h-10 w-32 rounded-lg"
                                {...field}
                                value={(field.value as number) || ''}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`${basePath}.description` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Brief description of what this video covers..."
                                className="min-h-20 resize-none rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Video Preview */}
            {form.watch(`${basePath}.video_url` as never) && (
                <div className="border-border bg-muted/30 rounded-lg border p-4">
                    <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
                        <div className="text-center">
                            <Video className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                            <p className="text-muted-foreground text-sm">
                                Video preview
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
