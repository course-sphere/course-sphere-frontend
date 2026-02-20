'use client';

import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, Upload, X, Link as LinkIcon } from 'lucide-react';
import { CourseMediaFormData } from '@/lib/service/course';

const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;

    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
};

export function MediaStep() {
    const { control, watch, setValue } = useFormContext<CourseMediaFormData>();

    const thumbnailUrl = watch('thumbnail_url');
    const videoUrl = watch('promo_video_url');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setValue('thumbnail_url', objectUrl, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

    const clearThumbnail = (e: React.MouseEvent) => {
        e.stopPropagation();
        setValue('thumbnail_url', '', {
            shouldDirty: true,
            shouldValidate: true,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ImageIcon className="text-primary h-5 w-5" />
                        Course Thumbnail
                    </CardTitle>
                    <CardDescription>
                        Upload an eye-catching image that represents your
                        course. Recommended size: 1280x720px (16:9 ratio).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div
                        className={`group relative aspect-video w-full max-w-xl overflow-hidden rounded-xl border-2 transition-all ${
                            !thumbnailUrl
                                ? 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 cursor-pointer border-dashed'
                                : 'border-transparent'
                        }`}
                        onClick={() =>
                            !thumbnailUrl && fileInputRef.current?.click()
                        }
                    >
                        {thumbnailUrl ? (
                            <div className="relative h-full w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={thumbnailUrl}
                                    alt="Course thumbnail"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        Change Image
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={clearThumbnail}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                                    <Upload className="text-primary h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-foreground font-medium">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        PNG, JPG up to 5MB
                                    </p>
                                </div>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileSelect}
                        />
                    </div>

                    <FormField
                        control={control}
                        name="thumbnail_url"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="bg-border h-px flex-1"></div>
                                    <FormLabel className="text-muted-foreground m-0 flex items-center gap-1 text-xs font-bold uppercase">
                                        <LinkIcon className="h-3 w-3" /> Or use
                                        URL
                                    </FormLabel>
                                    <div className="bg-border h-px flex-1"></div>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        className="h-11 rounded-xl"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Video className="text-primary h-5 w-5" />
                        Promotional Video (Optional)
                    </CardTitle>
                    <CardDescription>
                        Add a YouTube link to introduce your course. This helps
                        increase enrollment rates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={control}
                        name="promo_video_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>YouTube Video URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="h-11 rounded-xl"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {videoUrl && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <FormLabel className="mb-2 block">
                                Preview
                            </FormLabel>
                            {getYouTubeEmbedUrl(videoUrl) ? (
                                <div className="border-border aspect-video w-full max-w-xl overflow-hidden rounded-xl border shadow-sm">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={getYouTubeEmbedUrl(videoUrl) || ''}
                                        title="Video Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="border-0"
                                    />
                                </div>
                            ) : (
                                <div className="border-border bg-muted/10 flex aspect-video w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-dashed">
                                    <div className="text-muted-foreground p-6 text-center">
                                        <Video className="mx-auto mb-3 h-10 w-10 opacity-30" />
                                        <p className="font-medium">
                                            Invalid or unsupported YouTube URL
                                        </p>
                                        <p className="mt-1 text-xs">
                                            Please check the link and try again.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-border bg-primary/5 rounded-2xl">
                <CardContent className="p-4">
                    <h4 className="text-foreground mb-2 font-medium">
                        Tips for great course media
                    </h4>
                    <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
                        <li>Use high-quality images with good lighting</li>
                        <li>Include text overlay showing the course title</li>
                        <li>Keep promotional videos under 2 minutes</li>
                        <li>Show a preview of what students will learn</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
