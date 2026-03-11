'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ReadingViewer } from '@/components/course-builder/viewers/reading-viewer';
import { use, useMemo } from 'react';
import { VideoViewer } from '@/components/course-builder/viewers/video-viewer';
import { FileViewer } from '@/components/course-builder/viewers/file-viewer';
import { CodingViewer } from '@/components/course-builder/viewers/coding-viewer';
import { QuizViewer } from '@/components/course-builder/viewers/quiz-viewer';
import { cn } from '@/lib/utils';
import { useGetCourseMaterials } from '@/lib/service/course';

export default function LearnPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: courseId } = use(params);
    const searchParams = useSearchParams();
    const currentMaterialId = searchParams.get('materialId');

    const { data: rawMaterials = [], isLoading } =
        useGetCourseMaterials(courseId);

    const activeMaterial = useMemo(() => {
        if (!rawMaterials.length) return null;

        const foundRaw = currentMaterialId
            ? rawMaterials.find((m) => m.id === currentMaterialId)
            : rawMaterials[0];

        if (!foundRaw) return null;

        let mappedType = foundRaw.kind;
        if (mappedType === 'text') mappedType = 'reading';
        if (mappedType === 'assignment') mappedType = 'coding';

        const result: any = {
            id: foundRaw.id,
            title: foundRaw.title,
            item_type: mappedType,
            is_completed: false,
        };

        const contentStr = foundRaw.content || '';

        if (mappedType === 'reading') {
            result.reading_data = {
                content: contentStr,
                duration: 5,
            };
        } else if (mappedType === 'file') {
            const ext = contentStr.split('.').pop() || 'unknown';
            result.file_data = {
                file_url: contentStr,
                file_type: ext.length <= 4 ? ext : 'file',
                file_size: 0,
            };
        } else if (mappedType === 'video') {
            let vUrl = contentStr;
            let vDesc = '';
            const dashIndex = contentStr.indexOf('-');

            if (dashIndex !== -1) {
                vUrl = contentStr.substring(0, dashIndex);
                vDesc = contentStr.substring(dashIndex + 1);
            }

            result.video_data = {
                video_url: vUrl,
                description: vDesc,
                duration: 10,
            };
        }

        return result;
    }, [rawMaterials, currentMaterialId]);

    // TODO: API Complete, mark as done
    const handleComplete = () => {
        console.log(
            'POST /api/learn/materials/complete for:',
            activeMaterial?.id,
        );
    };

    const handleCodingSubmit = async (code?: string) => {
        if (!activeMaterial?.id) return;
        console.log('POST /api/learn/materials/coding/submit', {
            materialId: activeMaterial.id,
            submitted_code: code,
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!activeMaterial) {
        return (
            <div className="text-muted-foreground flex h-full items-center justify-center">
                <p>Select a lesson from the sidebar to start learning.</p>
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

    const renderContent = () => {
        switch (activeMaterial.item_type) {
            case 'reading':
                return <ReadingViewer material={activeMaterial} />;
            case 'video':
                return <VideoViewer material={activeMaterial} />;
            case 'file':
                return <FileViewer material={activeMaterial} />;
            case 'coding':
                return (
                    <CodingViewer
                        material={activeMaterial}
                        onSuccess={handleCodingSubmit}
                    />
                );
            case 'quiz':
                return (
                    <QuizViewer
                        material={activeMaterial}
                        onSuccess={handleComplete}
                    />
                );
            default:
                return (
                    <div className="text-destructive bg-destructive/10 rounded-xl p-8">
                        Unsupported content type!
                    </div>
                );
        }
    };

    const maxWidthClass = getContainerMaxWidth(activeMaterial.item_type);
    const needsManualCompletion = ['reading', 'file', 'video'].includes(
        activeMaterial.item_type,
    );

    return (
        <div className="flex min-h-full flex-col">
            <div
                className={cn(
                    'mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8',
                    maxWidthClass,
                )}
            >
                <h1 className="text-foreground mb-8 text-2xl font-bold sm:text-3xl">
                    {activeMaterial.title}
                </h1>

                {renderContent()}

                <div className="mt-10 flex items-center justify-between">
                    <div className="flex gap-3">
                        {needsManualCompletion &&
                            !activeMaterial.is_completed && (
                                <Button
                                    onClick={handleComplete}
                                    variant="secondary"
                                    className="rounded-xl font-medium"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                    Mark as Done
                                </Button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
