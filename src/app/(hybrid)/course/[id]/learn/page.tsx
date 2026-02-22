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

    const material = currentMaterialId
        ? mockMaterialDetails[currentMaterialId]
        : null;

    // TODO: API Complete
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
                    <div className="bg-muted/20 rounded-xl border border-dashed p-8 text-center">
                        Quiz Coming Soon...
                    </div>
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

    return (
        <div className="flex min-h-full flex-col">
            <div className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8">
                <h1 className="text-foreground mb-8 text-2xl font-bold sm:text-3xl">
                    {material.title}
                </h1>

                {renderContent()}
            </div>

            <div className="border-border/50 bg-background/95 sticky bottom-0 z-20 mt-auto border-t p-4 backdrop-blur sm:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="rounded-xl"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex gap-3">
                        {!material.is_completed && (
                            <Button
                                onClick={handleComplete}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Done
                            </Button>
                        )}

                        <Button
                            variant="default"
                            onClick={handleNext}
                            className="rounded-xl"
                        >
                            Next Lesson
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
