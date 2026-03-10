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
import {
    Video,
    Clock,
    Link as LinkIcon,
    Loader2,
    UploadCloud,
    CheckCircle,
} from 'lucide-react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

import {
    videoMaterialSchema,
    type VideoMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';

import { useGetPresignedUrl, uploadFileToS3 } from '@/lib/service/storage';

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
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const { mutateAsync: getPresignedUrl } = useGetPresignedUrl();

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

    const handleVideoUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            return;
        }

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            const presignedData = await getPresignedUrl({
                contentType: file.type,
                fileName: file.name.replace(/[^a-zA-Z0-9.]/g, '_'),
            });
            const finalUrl = await uploadFileToS3(file, presignedData);
            form.setValue('video_url', finalUrl, { shouldValidate: true });
            form.setValue('duration', 5, { shouldValidate: true });
            if (!form.getValues('title')) {
                form.setValue('title', file.name.split('.')[0], {
                    shouldValidate: true,
                });
            }
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                {/* 🎬 KHU VỰC UPLOAD VIDEO TƯƠNG TỰ FILE EDITOR */}
                <div className="border-border relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-blue-500/5 p-6 transition-colors hover:bg-blue-500/10">
                    <input
                        type="file"
                        accept="video/*"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                        onChange={handleVideoUpload}
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <div className="flex flex-col items-center text-blue-500">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                            <p className="text-sm font-medium">
                                Uploading Video to Cloud...
                            </p>
                        </div>
                    ) : uploadSuccess ? (
                        <div className="flex flex-col items-center text-green-500">
                            <CheckCircle className="mb-2 h-8 w-8" />
                            <p className="text-sm font-medium">
                                Video Uploaded!
                            </p>
                        </div>
                    ) : (
                        <div className="text-muted-foreground pointer-events-none flex flex-col items-center">
                            <UploadCloud className="mb-2 h-8 w-8 text-blue-500/70" />
                            <p className="text-foreground text-sm font-medium">
                                Click or drag video to upload
                            </p>
                            <p className="mt-1 text-xs">
                                Supports MP4, WebM...
                            </p>
                        </div>
                    )}
                </div>

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
                                            placeholder="https://youtube.com/watch?v=... or S3 Link"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        YouTube, Vimeo, or auto-filled from
                                        upload.
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
