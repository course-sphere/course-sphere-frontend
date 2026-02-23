'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { mockLearnSyllabus } from '@constant/sample-data';
import { BaseResizableSidebar } from '@/components/layout/base-sidebar';
import { StudentSyllabusMenu } from '@/components/layout/student-syllabus-menu';

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
    console.log(id);

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmitCourse = async () => {
        if (
            confirm(
                'Are you sure you want to submit this course for review? You will not be able to edit it while it is pending approval.',
            )
        ) {
            setIsSubmitting(true);
            console.log('GỌI API: POST /api/v1/courses/10/submit-for-review');

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setIsSubmitting(false);
            router.push('/course');
        }
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
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-amber-500/20 bg-amber-500/10 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2" />
                        <div className="bg-border mx-1 hidden h-4 w-px sm:block" />
                        <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-500">
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
                            className="rounded-xl border-amber-500/30 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Edit
                        </Button>

                        <Button
                            onClick={handleSubmitCourse}
                            disabled={isSubmitting}
                            className="rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600"
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
            </main>
        </SidebarProvider>
    );
}
