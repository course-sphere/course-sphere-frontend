'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockLearnSyllabus } from '@constant/sample-data';
import { BaseResizableSidebar } from '@/components/layout/base-sidebar';
import { StudentSyllabusMenu } from '@/components/layout/student-syllabus-menu';
// TODO:
/* 
  1. [Flow chuyển mình: Course Detail -> Learn Workspace]
      - Ở trang `/course/[id]/page.tsx` (Cái cục Sticky Checkout Card):
        + NẾU KHÓA FREE: Bấm "Enroll for Free" -> Pop-up Dialog xác nhận -> Gọi API POST `/enroll` -> Thành công thì `router.push('/course/[id]/learn')`
        + NẾU KHÓA PAID: Bấm "Add to Cart" / "Buy Now" -> Chuyển hướng sang trang `/cart` hoặc gọi cổng thanh toán (Stripe/VNPay) -> Thanh toán xong -> Redirect về trang Learn.
   2. [API GET Syllabus cho trang Learn]
      - File: `src/app/(hybrid)/course/[id]/learn/layout.tsx`
      - Logic: 
        + Vì trang Learn cần realtime (update progress liên tục)
        + Hook này gọi endpoint `GET /api/learn/courses/{id}/syllabus`
*/
export default function LearnLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const { user } = useAuthStore();
    const router = useRouter();

    //const { data: syllabus } = useLearnSyllabus(params.id);
    const syllabus = mockLearnSyllabus;

    const handleMaterialSelect = (materialId: string) => {
        console.log('Navigating to material:', materialId);
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <BaseResizableSidebar user={user} collapsible="offcanvas">
                <StudentSyllabusMenu
                    syllabusData={syllabus}
                    onMaterialSelect={handleMaterialSelect}
                />
            </BaseResizableSidebar>

            <main className="bg-background relative flex min-h-screen flex-1 flex-col overflow-hidden">
                <header className="bg-background border-border/50 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                            onClick={() => router.push(`/course/${params.id}`)}
                            title="Back to Course Overview"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="bg-border mx-1 hidden h-4 w-px sm:block" />{' '}
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        <h1 className="text-foreground ml-2 hidden text-sm font-semibold sm:block">
                            {syllabus.course_title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3"></div>
                </header>

                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>
        </SidebarProvider>
    );
}
