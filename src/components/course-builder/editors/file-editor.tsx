'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    File as FileIcon,
    Link as LinkIcon,
    UploadCloud,
    Loader2,
    CheckCircle,
} from 'lucide-react';

import {
    fileMaterialSchema,
    type FileMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';

interface FileEditorProps {
    initialData: DraftLessonItem | null;
    onSave: (data: FileMaterialFormValues) => void;
    onCancel: () => void;
}

export function FileEditor({ initialData, onSave, onCancel }: FileEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const form = useForm<FileMaterialFormValues>({
        resolver: zodResolver(fileMaterialSchema),
        defaultValues: {
            title: initialData?.title || '',
            is_required: initialData?.is_required ?? false,
            is_preview: initialData?.is_preview ?? false,
            file_url: initialData?.file_data?.file_url || '',
            file_type: initialData?.file_data?.file_type || '',
            file_size: initialData?.file_data?.file_size || 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                is_required: initialData.is_required,
                is_preview: initialData.is_preview,
                ...initialData.file_data,
            });
        }
    }, [initialData, form]);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            console.log(
                '1. Gọi API Backend xin Presigned URL cho file:',
                file.name,
            );

            console.log(
                '2. PUT file trực tiếp lên S3 bucket thông qua URL vừa xin',
            );

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(
                '3. Tự động điền data vào Form sau khi S3 báo thành công',
            );
            const fileExtension = file.name.split('.').pop() || 'unknown';
            const fakeS3Url = `https://s3.your-bucket.com/uploads/${Date.now()}_${file.name}`;
            const fileSizeKB = Math.round(file.size / 1024);

            form.setValue('file_url', fakeS3Url, { shouldValidate: true });
            form.setValue('file_type', fileExtension, { shouldValidate: true });
            form.setValue('file_size', fileSizeKB, { shouldValidate: true });

            if (!form.getValues('title')) {
                form.setValue('title', file.name.split('.')[0], {
                    shouldValidate: true,
                });
            }

            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="border-border bg-muted/10 hover:bg-muted/30 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors">
                    <input
                        type="file"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />

                    {isUploading ? (
                        <div className="text-primary flex flex-col items-center">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                            <p className="text-sm font-medium">
                                Uploading to S3 directly...
                            </p>
                        </div>
                    ) : uploadSuccess ? (
                        <div className="flex flex-col items-center text-green-500">
                            <CheckCircle className="mb-2 h-8 w-8" />
                            <p className="text-sm font-medium">File ready!</p>
                        </div>
                    ) : (
                        <div className="text-muted-foreground pointer-events-none flex flex-col items-center">
                            <UploadCloud className="mb-2 h-8 w-8" />
                            <p className="text-foreground text-sm font-medium">
                                Click or drag file to upload
                            </p>
                            <p className="mt-1 text-xs">
                                Supports PDF, ZIP, DOCX...
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
                                <FormLabel>Resource Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Cheat Sheet PDF"
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
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <FileIcon className="h-4 w-4" /> File Details
                        (Auto-filled)
                    </div>

                    <FormField
                        control={form.control}
                        name="file_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <LinkIcon className="h-3.5 w-3.5" /> Direct
                                    File URL
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="file_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Extension</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="pdf, zip, docx..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file_size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Size (KB)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
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
                        Save Resource
                    </Button>
                </div>
            </form>
        </Form>
    );
}
