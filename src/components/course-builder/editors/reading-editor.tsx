'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FileText, Clock } from 'lucide-react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

import {
    readingMaterialSchema,
    type ReadingMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';

interface ReadingEditorProps {
    initialData: DraftLessonItem | null;
    onSave: (data: ReadingMaterialFormValues) => void;
    onCancel: () => void;
}

const getWordCountFromHtml = (htmlString: string) => {
    if (!htmlString) return 0;
    const plainText = htmlString.replace(/<[^>]+>/g, '');
    return plainText.trim().split(/\s+/).filter(Boolean).length;
};

export function ReadingEditor({
    initialData,
    onSave,
    onCancel,
}: ReadingEditorProps) {
    const form = useForm<ReadingMaterialFormValues>({
        resolver: zodResolver(readingMaterialSchema),
        defaultValues: {
            title: initialData?.title || '',
            is_required: initialData?.is_required ?? true,
            is_preview: initialData?.is_preview ?? false,
            content: initialData?.reading_data?.content || '',
            duration: initialData?.reading_data?.duration || 5,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                is_required: initialData.is_required,
                is_preview: initialData.is_preview,
                ...initialData.reading_data,
            });
        }
    }, [initialData, form]);

    const content =
        useWatch({
            control: form.control,
            name: 'content',
        }) || '';

    const { wordCount, estimatedTime } = useMemo(() => {
        const words = getWordCountFromHtml(content);
        return {
            wordCount: words,
            estimatedTime: Math.max(1, Math.round(words / 200)),
        };
    }, [content]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="bg-muted/30 border-border space-y-4 rounded-xl border p-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Article Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Understanding the Basics"
                                        className="bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-6 pt-2">
                        <FormField
                            control={form.control}
                            name="is_required"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Required to complete
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_preview"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Free preview
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-500">
                        <FileText className="h-4 w-4" /> Reading Content
                    </div>

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        value={field.value}
                                        onChange={(val) => {
                                            field.onChange(val);
                                        }}
                                        className="w-full"
                                        editorContentClassName="p-5 min-h-[300px]"
                                        output="html"
                                        placeholder="Write your comprehensive article here..."
                                        autofocus={false}
                                        editable={true}
                                        editorClassName="focus:outline-none"
                                    />
                                </FormControl>
                                <FormDescription className="text-muted-foreground flex justify-end">
                                    <span>
                                        {wordCount} words (~{estimatedTime} min
                                        read)
                                    </span>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" /> Est.
                                    Duration (minutes)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        className="w-32"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="border-border flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl">
                        Save Article
                    </Button>
                </div>
            </form>
        </Form>
    );
}
