'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { mockLearnSyllabus } from '@constant/sample-data';
import { BaseResizableSidebar } from '@/components/layout/base-sidebar';
import { StudentSyllabusMenu } from '@/components/layout/student-syllabus-menu';

export default function LearnLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    console.log(params);
    const { user } = useAuthStore();

    // const { data: syllabus } = useLearnSyllabus(params.id);
    const syllabus = mockLearnSyllabus;

    const handleMaterialSelect = (materialId: string) => {
        console.log('Navigating to material:', materialId);
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <BaseResizableSidebar user={user}>
                <StudentSyllabusMenu
                    syllabusData={syllabus}
                    onMaterialSelect={handleMaterialSelect}
                />
            </BaseResizableSidebar>

            <main className="bg-background relative flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="-ml-2" />
                        <h1 className="text-muted-foreground hidden text-sm font-medium sm:block">
                            {syllabus.course_title}
                        </h1>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="hover:text-primary text-sm font-medium transition-colors"
                    >
                        Exit Course
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>
        </SidebarProvider>
    );
}
