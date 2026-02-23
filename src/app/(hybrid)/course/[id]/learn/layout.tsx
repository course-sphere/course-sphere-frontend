'use client';

import React, { use, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { mockLearnSyllabus } from '@constant/sample-data';
import { BaseResizableSidebar } from '@/components/layout/base-sidebar';
import { StudentSyllabusMenu } from '@/components/layout/student-syllabus-menu';
import { CourseOptionsDropdown } from '@/components/course-options-dropdown';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    3. [Dropdown Menu: Đánh giá khóa học]
      - Gọi: POST `/api/courses/{id}/reviews`
      - Chức năng: Mở Modal khi bấm "Leave a Review", submit đánh giá của user.

    4. [Dropdown Menu: Hoàn thành nhanh bài học]
      - Gọi: POST `/api/learn/materials/{materialId}/complete`
      - Chức năng: Đánh dấu bài học hiện tại là đã xong. BE lưu lại, trả về % tiến độ mới để FE update lại vòng tròn Progress.
*/
export default function LearnLayout({
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

    //const { data: syllabus } = useLearnSyllabus(id);
    const syllabus = mockLearnSyllabus;
    const currentMaterialId = searchParams.get('materialId');

    // fetch syllabus to check the last lesson that user learn and change the URL for resume
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
                <header className="bg-background border-border/50 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        <h1 className="text-foreground ml-2 hidden text-sm font-semibold sm:block">
                            {syllabus.course_title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <CourseOptionsDropdown
                            courseId={id}
                            progressPercentage={syllabus.progress.percentage}
                        />
                    </div>{' '}
                </header>

                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>
        </SidebarProvider>
    );
}
