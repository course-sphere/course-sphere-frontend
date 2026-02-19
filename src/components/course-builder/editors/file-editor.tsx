'use client';

import React from 'react';

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
import { Button } from '@/components/ui/button';
import {
    File,
    Link as LinkIcon,
    Upload,
    FileArchive,
    FileImage,
    FileCode,
} from 'lucide-react';
import type { CourseModuleFormData } from '@/lib/schemas/course';
import { unknown } from 'better-auth';

interface FileEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    basePath: string;
}

const FILE_ICONS: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    zip: FileArchive,
    rar: FileArchive,
    '7z': FileArchive,
    png: FileImage,
    jpg: FileImage,
    jpeg: FileImage,
    gif: FileImage,
    js: FileCode,
    ts: FileCode,
    py: FileCode,
    html: FileCode,
    css: FileCode,
};

export function FileEditor({ form, basePath }: FileEditorProps) {
    const fileUrl =
        (form.watch(`${basePath}.file_url` as any) as unknown as string) || '';
    const fileType =
        (form.watch(`${basePath}.file_type` as any) as unknown as string) || '';

    // Extract file extension from URL or type
    const getFileExtension = () => {
        if (fileType) return fileType.toLowerCase();
        if (fileUrl) {
            const ext = fileUrl.split('.').pop()?.toLowerCase();
            return ext || '';
        }
        return '';
    };

    const extension = getFileExtension();
    const FileIcon = FILE_ICONS[extension] || File;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <File className="h-4 w-4" />
                Downloadable File
            </div>

            <FormField
                control={form.control}
                name={`${basePath}.file_url` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5" />
                            File URL
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="https://example.com/file.zip"
                                className="h-10 rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Direct link to the downloadable file
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`${basePath}.file_type` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Type</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., pdf, zip, docx"
                                    className="h-10 rounded-lg"
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
                    name={`${basePath}.file_size` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Size (KB)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 1024"
                                    className="h-10 rounded-lg"
                                    {...field}
                                    value={(field.value as number) || ''}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* File Preview */}
            {fileUrl && (
                <div className="border-border bg-muted/30 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                            <FileIcon className="text-muted-foreground h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {fileUrl.split('/').pop() || 'File'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {extension.toUpperCase()} file
                                {form.watch(
                                    `${basePath}.file_size` as never,
                                ) && (
                                        <span>
                                            {' '}
                                            (
                                            {Math.round(
                                                (form.watch(
                                                    `${basePath}.file_size` as any,
                                                ) as number) / 1024,
                                            )}{' '}
                                            KB)
                                        </span>
                                    )}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg bg-transparent"
                            asChild
                        >
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Preview
                            </a>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
