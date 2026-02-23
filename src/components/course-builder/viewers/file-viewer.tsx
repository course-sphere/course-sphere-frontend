'use client';

import {
    Download,
    FileText,
    FileArchive,
    FileImage,
    FileCode,
    File as FileIcon,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMaterialContent } from '@/lib/service/lesson';

interface FileViewerProps {
    material: LearnMaterialContent;
}

// format fize size
const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
};

// support code file cause the domain is coding course platform
const getFileIcon = (fileType?: string) => {
    const type = fileType?.toLowerCase() || '';
    if (['zip', 'rar', 'tar', 'gz'].includes(type))
        return <FileArchive className="h-12 w-12 text-amber-500" />;
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(type))
        return <FileImage className="h-12 w-12 text-emerald-500" />;
    if (['js', 'ts', 'py', 'go', 'html', 'css', 'json'].includes(type))
        return <FileCode className="h-12 w-12 text-blue-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(type))
        return <FileText className="h-12 w-12 text-rose-500" />;
    return <FileIcon className="text-muted-foreground h-12 w-12" />;
};

export function FileViewer({ material }: FileViewerProps) {
    const fileData = material.file_data;

    if (!fileData) {
        return (
            <div className="text-muted-foreground bg-muted/20 rounded-xl border border-dashed p-8 text-center">
                Attachment data is missing.
            </div>
        );
    }

    const handleDownload = () => {
        window.open(fileData.file_url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="mx-auto mt-4 w-full max-w-3xl">
            <div className="bg-card border-border/60 flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-sm sm:p-12">
                <div className="bg-muted/50 ring-muted/20 mb-6 rounded-full p-4 ring-8">
                    {getFileIcon(fileData.file_type)}
                </div>

                <h3 className="text-foreground mb-2 line-clamp-2 text-xl font-bold break-all">
                    {fileData.file_url.split('/').pop() ||
                        'Download Attachment'}
                </h3>

                <div className="text-muted-foreground bg-muted/30 mb-8 flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium">
                    <span className="tracking-wider uppercase">
                        {fileData.file_type || 'FILE'}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(fileData.file_size)}</span>
                </div>

                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                    <Button
                        size="lg"
                        className="rounded-xl px-8 shadow-md"
                        onClick={handleDownload}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                    </Button>

                    {['pdf', 'png', 'jpg', 'jpeg'].includes(
                        fileData.file_type?.toLowerCase() || '',
                    ) && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-xl px-8"
                            onClick={handleDownload}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                    )}
                </div>

                <p className="text-muted-foreground mt-6 max-w-sm text-xs">
                    This file is provided by the instructor to help you complete
                    this module. Make sure to keep it somewhere safe on your
                    computer.
                </p>
            </div>
        </div>
    );
}
