'use client';

import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mockMaterialDetails } from '@constant/sample-data';
import { ReadingViewer } from '@/components/course-builder/viewers/reading-viewer';
import { FileViewer } from '@/components/course-builder/viewers/file-viewer';
import { QuizViewer } from '@/components/course-builder/viewers/quiz-viewer';
import { CodingViewer } from '@/components/course-builder/viewers/coding-viewer';
import { VideoViewer } from '@/components/course-builder/viewers/video-viewer';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const currentMaterialId = searchParams.get('materialId');

    const material = currentMaterialId
        ? mockMaterialDetails[currentMaterialId]
        : null;

    if (!material) {
        return (
            <div className="text-muted-foreground flex h-full items-center justify-center p-20">
                Please select a lesson to preview.
            </div>
        );
    }

    const getContainerMaxWidth = (type?: string) => {
        switch (type) {
            case 'coding':
                return 'max-w-7xl';
            case 'video':
                return 'max-w-5xl';
            case 'reading':
                return 'max-w-4xl';
            case 'quiz':
                return 'max-w-4xl';
            case 'file':
                return 'max-w-3xl';
            default:
                return 'max-w-5xl';
        }
    };

    const maxWidthClass = getContainerMaxWidth(material.item_type);

    const renderContent = () => {
        switch (material.item_type) {
            case 'reading':
                return <ReadingViewer material={material} />;
            case 'video':
                return <VideoViewer material={material} />;
            case 'coding':
                return <CodingViewer material={material} isPreview={true} />;
            case 'quiz':
                return <QuizViewer material={material} isPreview={true} />;
            case 'file':
                return <FileViewer material={material} />;
            default:
                return (
                    <div className="text-destructive p-8 text-center">
                        Unsupported format
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-full flex-col">
            <div
                className={cn(
                    'mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8',
                    maxWidthClass,
                )}
            >
                <h1 className="text-foreground mb-8 text-2xl font-bold sm:text-3xl">
                    {material.title}
                </h1>

                {renderContent()}
            </div>
        </div>
    );
}
