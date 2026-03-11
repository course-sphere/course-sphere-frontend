'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface InlineMediaEditProps {
    url: string;
    type: 'image' | 'video';
    onUploadAndSave: (file: File) => Promise<string>;
    label?: string;
    className?: string;
}

export function InlineMediaEdit({
    url,
    type,
    onUploadAndSave,
    label,
    className = '',
}: InlineMediaEditProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>(url);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setIsUploading(true);

        try {
            const finalS3Url = await onUploadAndSave(file);

            setPreviewUrl(finalS3Url);
        } catch (error) {
            console.error('Lỗi khi upload media:', error);
            setPreviewUrl(url);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            URL.revokeObjectURL(objectUrl);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {label}
                </label>
            )}

            <div
                className="group border-border bg-muted/30 hover:border-primary/50 relative aspect-video w-full max-w-xl cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all"
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        {type === 'image' ? (
                            <Image
                                src={previewUrl}
                                alt="Media"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                                <Play className="h-12 w-12 text-white/70" />
                            </div>
                        )}

                        {/* Overlay khi Hover hoặc đang Upload */}
                        <div
                            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                                    <p className="text-sm font-medium text-white">
                                        Uploading to cloud...
                                    </p>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="rounded-xl"
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Change{' '}
                                    {type}
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                        <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                            {type === 'image' ? (
                                <ImageIcon className="text-primary h-8 w-8" />
                            ) : (
                                <Play className="text-primary h-8 w-8" />
                            )}
                        </div>
                        <p className="font-medium">Click to upload {type}</p>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={
                        type === 'image'
                            ? 'image/png, image/jpeg, image/webp'
                            : 'video/mp4, video/webm'
                    }
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />
            </div>
        </div>
    );
}
