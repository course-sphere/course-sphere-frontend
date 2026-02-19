'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Send,
    Save,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/fake-data';
import type { CourseFormData, CourseModuleFormData, CourseMetadataFormData } from '@/lib/schemas/course';
import { getDefaultCourseData } from '@/lib/schemas/course';
import { PhaseIndicator } from '@/components/course-builder/phase-indicator';
import { ReviewStep } from '@/components/course-builder/steps/review-step';
import { PHASES } from '@/components/course-builder/constant';

export default function ReviewPage() {
    const router = useRouter();
    const user = getCurrentUser('teacher');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [courseData, setCourseData] = useState<CourseFormData | null>(null);

    // Assemble course data from sessionStorage
    useEffect(() => {
        const storedMetadata = sessionStorage.getItem('course_metadata');
        const storedModules = sessionStorage.getItem('course_modules');
        const storedCourseId = sessionStorage.getItem('course_draft_id');

        if (!storedCourseId || !storedMetadata) {
            // No course data, redirect back
            router.push('/course/create');
            return;
        }

        try {
            const metadata: CourseMetadataFormData = JSON.parse(storedMetadata);
            const modules: CourseModuleFormData = storedModules
                ? JSON.parse(storedModules)
                : { modules: [] };

            // Assemble full CourseFormData from metadata + modules
            const assembled: CourseFormData = {
                ...getDefaultCourseData(),
                ...metadata,
                modules: modules.modules,
            };

            setCourseData(assembled);
        } catch {
            router.push('/course/create');
        }
    }, [router]);

    const handleSubmitForReview = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call to submit course for review
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Clear sessionStorage
            sessionStorage.removeItem('course_metadata');
            sessionStorage.removeItem('course_modules');
            sessionStorage.removeItem('course_draft_id');

            // Navigate to courses list
            router.push('/teacher/courses');
        } catch {
            // Handle error
        } finally {
            setIsSubmitting(false);
            setShowSubmitDialog(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call to save as draft
            await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch {
            // Handle error
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!courseData) {
        return null; // Loading / redirect in progress
    }

    return (
        <div className="bg-background min-h-screen">
            <DashboardSidebar
                role="teacher"
                userName={user.name}
                userEmail={user.email}
            />

            <div className="pl-64">
                <DashboardHeader title="Review Course" />

                <main className="p-6">
                    <Button variant="ghost" className="mb-6" asChild>
                        <Link href="/course/create/modules">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Module Builder
                        </Link>
                    </Button>

                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8">
                            <h1 className="text-foreground text-2xl font-bold">
                                Review Your Course
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Review all your course details before submitting
                            </p>
                        </div>

                        {/* Phase Indicator */}
                        <PhaseIndicator
                            phases={PHASES}
                            currentPhase={3}
                        />

                        {/* Review Content */}
                        <ReviewStep data={courseData} />

                        {/* Navigation Buttons */}
                        <div className="border-border flex items-center justify-between border-t pt-6 mt-6">
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.push('/course/create/modules')
                                    }
                                    className="rounded-xl bg-transparent"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Modules
                                </Button>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Save Draft Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-transparent"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save as Draft
                                </Button>

                                {/* Submit for Review */}
                                <Button
                                    type="button"
                                    onClick={() => setShowSubmitDialog(true)}
                                    disabled={isSubmitting}
                                    className="rounded-xl"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit for Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Submit Confirmation Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Submit Course for Review</DialogTitle>
                        <DialogDescription>
                            Your course will be reviewed by our team. This
                            usually takes 1-2 business days. You can still edit
                            your course while it&apos;s under review.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitDialog(false)}
                            className="rounded-xl bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitForReview}
                            disabled={isSubmitting}
                            className="rounded-xl"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            Confirm Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
