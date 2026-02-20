'use client';

import { useEffect, useState } from 'react';
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
import { Video, Clock, Link as LinkIcon, Loader2 } from 'lucide-react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

import {
    videoMaterialSchema,
    type VideoMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';

interface VideoEditorProps {
    initialData: DraftLessonItem | null;
    onSave: (data: VideoMaterialFormValues) => void;
    onCancel: () => void;
}

export function VideoEditor({
    initialData,
    onSave,
    onCancel,
}: VideoEditorProps) {
    const [isFetchingDuration, setIsFetchingDuration] = useState(false);

    const form = useForm<VideoMaterialFormValues>({
        resolver: zodResolver(videoMaterialSchema),
        defaultValues: {
            title: initialData?.title || '',
            is_required: initialData?.is_required ?? true,
            is_preview: initialData?.is_preview ?? false,
            video_url: initialData?.video_data?.video_url || '',
            duration: initialData?.video_data?.duration || 1,
            description: initialData?.video_data?.description || '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                is_required: initialData.is_required,
                is_preview: initialData.is_preview,
                ...initialData.video_data,
            });
        }
    }, [initialData, form]);

    const videoUrl = useWatch({
        control: form.control,
        name: 'video_url',
    });

    useEffect(() => {
        if (!videoUrl) return;

        const isYoutube =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(
                videoUrl,
            );

        if (isYoutube && !initialData) {
            let isMounted = true;

            const fetchDuration = async () => {
                if (isMounted) setIsFetchingDuration(true);

                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (isMounted) {
                    form.setValue('duration', 15, { shouldValidate: true });
                    setIsFetchingDuration(false);
                }
            };

            fetchDuration();

            return () => {
                isMounted = false;
            };
        }
    }, [videoUrl, form, initialData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="bg-muted/30 border-border space-y-4 rounded-xl border p-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lesson Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Introduction to the course"
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
                                        Free preview (Trailer)
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                        <Video className="h-4 w-4" /> Video Settings
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="video_url"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="flex items-center gap-1.5">
                                        <LinkIcon className="h-3.5 w-3.5" />{' '}
                                        Video URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://youtube.com/watch?v=..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        YouTube, Vimeo, or direct link.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem className="md:col-span-1">
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />{' '}
                                        Duration (min)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                className="pr-8"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                disabled={isFetchingDuration}
                                            />
                                            {isFetchingDuration && (
                                                <Loader2 className="text-muted-foreground absolute top-2.5 right-2 h-4 w-4 animate-spin" />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        {isFetchingDuration
                                            ? 'Auto-fetching...'
                                            : 'Manual input allowed'}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        className="w-full"
                                        editorContentClassName="p-5 min-h-[150px]"
                                        output="html"
                                        placeholder="Briefly describe what students will learn in this video..."
                                        autofocus={false}
                                        editable={true}
                                        editorClassName="focus:outline-none"
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
                        Save Video
                    </Button>
                </div>
            </form>
        </Form>
    );
}
