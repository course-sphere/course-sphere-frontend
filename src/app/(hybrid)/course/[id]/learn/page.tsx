'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { mockLearnSyllabus, mockMaterialDetails } from '@constant/sample-data';
import { ReadingViewer } from '@/components/course-builder/viewers/reading-viewer';
import { use } from 'react';
import { VideoViewer } from '@/components/course-builder/viewers/video-viewer';
import { FileViewer } from '@/components/course-builder/viewers/file-viewer';
import { CodingViewer } from '@/components/course-builder/viewers/coding-viewer';
import { QuizViewer } from '@/components/course-builder/viewers/quiz-viewer';
import { cn } from '@/lib/utils';

export default function LearnPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    console.log(id);
    const searchParams = useSearchParams();

    const currentMaterialId =
        searchParams.get('materialId') || mockLearnSyllabus.active_material_id;

    // TODO: Base on the materialId that layout inject, fetch API to get data
    const material = currentMaterialId
        ? mockMaterialDetails[currentMaterialId]
        : null;

    // TODO: API Complete, mark as done
    const handleComplete = () => {
        console.log(
            'POST /api/learn/materials/complete for:',
            currentMaterialId,
        );
    };

    const handleNext = () => {
        // router.push(`/course/${id}/learn?materialId=...`)
    };

    const handlePrev = () => {
        // router.push(`/course/${id}/learn?materialId=...`)
    };

    if (!material) {
        return (
            <div className="text-muted-foreground flex h-full items-center justify-center">
                <p>Select a lesson from the sidebar to start learning.</p>
            </div>
        );
    }

    const getContainerMaxWidth = (type?: string) => {
        switch (type) {
            case 'coding':
                return 'max-w-[1400px]';
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
        switch (material.item_type) {
            case 'reading':
                return <ReadingViewer material={material} />;
            case 'video':
                return <VideoViewer material={material} />;
            case 'coding':
                return (
                    <CodingViewer
                        material={material}
                        onSuccess={handleComplete}
                    />
                );
            case 'quiz':
                return (
                    <QuizViewer
                        material={material}
                        onSuccess={handleComplete}
                    />
                );
            case 'file':
                return <FileViewer material={material} />;
            default:
                return (
                    <div className="text-destructive bg-destructive/10 rounded-xl p-8">
                        Unsupported content type!
                    </div>
                );
        }
    };
    const maxWidthClass = getContainerMaxWidth(material?.item_type);
    const needsManualCompletion = ['reading', 'file', 'video'].includes(
        material.item_type,
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
                    {material.title}
                </h1>

                {renderContent()}

                <div className="border-border/50 mt-16 border-t pt-8 pb-12">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            className="rounded-xl"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>

                        <div className="flex gap-3">
                            {needsManualCompletion &&
                                !material.is_completed && (
                                    <Button
                                        onClick={handleComplete}
                                        variant="secondary"
                                        className="rounded-xl font-medium"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                        Mark as Done
                                    </Button>
                                )}

                            <Button
                                variant="default"
                                onClick={handleNext}
                                className="rounded-xl shadow-md"
                            >
                                Next Lesson{' '}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
