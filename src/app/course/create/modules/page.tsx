'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form'; // Bổ sung FormProvider
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
    ArrowLeft,
    ArrowRight,
    Save,
    Loader2,
    CheckCircle,
} from 'lucide-react';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { getCurrentUser } from '@/lib/fake-data';
import {
    courseModuleFormSchema,
    getDefaultModuleData,
    type CourseModuleFormData,
} from '@/lib/service/course';
import { PhaseIndicator } from '@/components/course-builder/phase-indicator';
import { CurriculumStep } from '@/components/course-builder/steps/curriculum-step';
import { PHASES } from '@/components/course-builder/constant';

export default function ModuleBuilderPage() {
    const router = useRouter();
    const user = getCurrentUser('teacher');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Trạng thái loading chờ check local

    // 1. Khởi tạo form
    const methods = useForm<CourseModuleFormData>({
        resolver: zodResolver(courseModuleFormSchema),
        defaultValues: getDefaultModuleData(),
        mode: 'onChange',
    });

    const { formState, getValues, reset, watch, trigger } = methods;

    // 2. Load data từ LocalStorage khi mount component (Client-side)
    useEffect(() => {
        const storedCourseId = localStorage.getItem('course_draft_id');
        if (!storedCourseId) {
            // Chưa đi qua Phase 1 -> Đá về trang tạo khóa học
            router.replace('/course/create');
            return;
        }

        // Nếu có data cũ lưu trong máy, nạp thẳng vào form để tiếp tục sửa
        const savedModulesStr = localStorage.getItem('course_modules');
        if (savedModulesStr) {
            try {
                const savedModules = JSON.parse(savedModulesStr);
                reset(savedModules); // Hàm reset của RHF sẽ update toàn bộ defaultValues
            } catch (e) {
                console.error('Failed to parse saved modules', e);
            }
        }

        setIsCheckingAuth(false);
    }, [router, reset]);

    // Track unsaved changes
    useEffect(() => {
        const subscription = watch(() => {
            setIsSaved(false);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // 3. Xử lý Save
    const handleSaveModules = async () => {
        setIsSubmitting(true);
        try {
            const data = getValues();
            console.log('Saving Draft Modules...', data);

            // Fake API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            // CHUYỂN SANG LOCALSTORAGE
            localStorage.setItem('course_modules', JSON.stringify(data));

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);

            // Cập nhật lại trạng thái pristine của form
            reset(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinueToReview = async () => {
        const isValid = await trigger();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            const data = getValues();
            console.log('Submitting Modules to Review...', data);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            // CHUYỂN SANG LOCALSTORAGE
            localStorage.setItem('course_modules', JSON.stringify(data));

            router.push('/course/create/review');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nếu đang check Hydration hoặc không có quyền -> Trả về màng hình trắng tránh chớp UI
    if (isCheckingAuth) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <div className="bg-background min-h-screen">
                <DashboardSidebar
                    role="teacher"
                    userName={user.name}
                    userEmail={user.email}
                />

                <div className="pl-64">
                    <DashboardHeader title="Module Builder" />

                    <main className="p-6">
                        <Button variant="ghost" className="mb-6" asChild>
                            <Link href="/course/create">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Course Info
                            </Link>
                        </Button>

                        <div className="mx-auto max-w-5xl">
                            <div className="mb-8">
                                <h1 className="text-foreground text-2xl font-bold">
                                    Build Your Modules
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Organize your course content into modules
                                    and lessons
                                </p>
                            </div>

                            <PhaseIndicator phases={PHASES} currentPhase={2} />

                            <Form {...methods}>
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    {/* Đã xóa props form={}
                                        CurriculumStep giờ sẽ tự động lấy data từ Context
                                    */}
                                    <CurriculumStep />

                                    <div className="border-border bg-background/95 sticky bottom-0 z-10 flex items-center justify-between border-t py-4 pt-6 backdrop-blur">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.push(
                                                        '/course/create',
                                                    )
                                                }
                                                className="rounded-xl bg-transparent"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Course Info
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isSaved && (
                                                <span className="flex items-center text-sm text-green-600">
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Saved
                                                </span>
                                            )}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleSaveModules}
                                                disabled={
                                                    isSubmitting ||
                                                    !formState.isDirty
                                                }
                                                className="rounded-xl bg-transparent"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="mr-2 h-4 w-4" />
                                                )}
                                                Save Modules
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={handleContinueToReview}
                                                disabled={isSubmitting}
                                                className="rounded-xl"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ArrowRight className="mr-2 h-4 w-4" />
                                                )}
                                                Continue to Review
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </main>
                </div>
            </div>
        </FormProvider>
    );
}
