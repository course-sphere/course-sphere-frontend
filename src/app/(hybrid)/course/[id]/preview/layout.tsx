'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { BaseResizableSidebar } from '@/components/layout/base-sidebar';
import { StudentSyllabusMenu } from '@/components/layout/student-syllabus-menu';
import { ConfirmDialog } from '@/components/confirm-dialog'; // Thêm import này
import { mockLearnSyllabus } from '@constant/sample-data';

export default function PreviewLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { user } = useAuthStore();
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

    const syllabus = mockLearnSyllabus;
    const currentMaterialId = searchParams.get('materialId');

    useEffect(() => {
        if (!currentMaterialId && syllabus.active_material_id) {
            router.replace(
                `${pathname}?materialId=${syllabus.active_material_id}`,
            );
        }
    }, [currentMaterialId, pathname, router, syllabus.active_material_id]);

    const handleMaterialSelect = (materialId: string) => {
        router.push(`${pathname}?materialId=${materialId}`);
    };

    const handleSubmitClick = () => {
        setIsSubmitDialogOpen(true);
    };

    const executeSubmitCourse = async () => {
        setIsSubmitDialogOpen(false);
        setIsSubmitting(true);

        console.log(`POST /api/v1/courses/${id}/submit-for-review`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        router.push('/course');
    };

    const dynamicSyllabus = {
        ...syllabus,
        active_material_id: currentMaterialId || syllabus.active_material_id,
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <BaseResizableSidebar user={user} collapsible="offcanvas">
                <StudentSyllabusMenu
                    syllabusData={dynamicSyllabus}
                    onMaterialSelect={handleMaterialSelect}
                />
            </BaseResizableSidebar>
            <main className="bg-background relative flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="border-primary/20 bg-primary/5 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2" />
                        <div className="bg-border mx-1 hidden h-4 w-px sm:block" />
                        <div className="text-primary flex items-center gap-2 text-sm font-bold">
                            <Eye className="h-5 w-5" />
                            Instructor Preview Mode
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push('/course/create/modules')
                            }
                            className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary rounded-xl"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Edit
                        </Button>{' '}
                        <Button
                            onClick={handleSubmitClick}
                            disabled={isSubmitting}
                            className="rounded-xl shadow-md"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            Submit for Review
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">{children}</div>

                <ConfirmDialog
                    open={isSubmitDialogOpen}
                    onOpenChangeAction={setIsSubmitDialogOpen}
                    title="Submit Course"
                    description="Are you sure you want to submit this course for review? You will not be able to edit the content while it is pending approval by the Admin."
                    confirmText="Submit"
                    onConfirmAction={executeSubmitCourse}
                />
            </main>{' '}
        </SidebarProvider>
    );
}
