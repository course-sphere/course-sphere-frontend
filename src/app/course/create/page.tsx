'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    ArrowLeft,
    ArrowRight,
    Save,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

import { PhaseIndicator } from '@/components/course-builder/phase-indicator';
import { BasicInfoStep } from '@/components/course-builder/steps/basic-info-step';
import { MediaStep } from '@/components/course-builder/steps/media-step';
import { PricingStep } from '@/components/course-builder/steps/pricing-step';
import { GoalsStep } from '@/components/course-builder/steps/goals-step';
import { METADATA_STEPS, PHASES } from '@/components/course-builder/constant';

import {
    courseMetadataSchema,
    courseBasicInfoSchema,
    courseMediaSchema,
    coursePricingSchema,
    courseGoalsSchema,
    type CourseMetadataFormData,
    getDefaultMetadataData,
} from '@/lib/service/course';

const STEP_SCHEMAS = {
    1: courseBasicInfoSchema,
    2: courseMediaSchema,
    3: coursePricingSchema,
    4: courseGoalsSchema,
};
// 1. API FLOW (DRAFT MODE):
// Step 1: POST /api/v1/courses -> Creates record, sets status="DRAFT", returns course_id.
// Steps 2-4: PATCH /api/v1/courses/{course_id} -> Updates the existing draft.
// 2. MEDIA UPLOAD:
// DO NOT send 'blob:http...' URLs to BE.
// Flow: Request S3 Presigned URL -> PUT file to S3 -> Update form state with real S3 URL -> PATCH to BE.
// 3. LOCAL STORAGE:
// Remove final localStorage.setItem from handleCreateCourse.
// Repurpose localStorage strictly for background auto-save (form recovery on accidental tab close).
// 4. DATA MAPPING:
// RHF uses Object Arrays: e.g., learning_objectives = [{ value: "text" }].
// Either map to List<String> via .map(item => item.value) before payload submission, OR ensure BE handles it via JSONB.
export default function CreateCoursePage() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const methods = useForm<CourseMetadataFormData>({
        resolver: zodResolver(courseMetadataSchema),
        defaultValues: getDefaultMetadataData(),
        mode: 'onChange',
    });

    const { formState, trigger, getValues, reset } = methods;
    const { isDirty } = formState;

    const validateCurrentStep = async (): Promise<boolean> => {
        const currentSchema =
            STEP_SCHEMAS[currentStep as keyof typeof STEP_SCHEMAS];
        if (!currentSchema) return true;

        const fieldsToValidate = Object.keys(
            currentSchema.shape,
        ) as (keyof CourseMetadataFormData)[];
        const result = await trigger(fieldsToValidate);
        return result;
    };

    const handleNext = async () => {
        const isStepValid = await validateCurrentStep();
        if (isStepValid && currentStep < METADATA_STEPS.length) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSaveDraft = async () => {
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        reset(getValues());
        setLastSaved(new Date());
        setIsSubmitting(false);
    };

    const handleCreateCourse = async () => {
        const isStepValid = await validateCurrentStep();
        if (!isStepValid) return;

        const isAllValid = await trigger();
        if (!isAllValid) return;

        setIsSubmitting(true);
        try {
            const data = getValues();
            console.log('Course Metadata:', data);

            await new Promise((resolve) => setTimeout(resolve, 2000));
            localStorage.setItem('course_metadata', JSON.stringify(data));
            localStorage.setItem('course_draft_id', `course-${Date.now()}`);
            router.push('/course/create/modules');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep />;
            case 2:
                return <MediaStep />;
            case 3:
                return <PricingStep />;
            case 4:
                return <GoalsStep />;
            default:
                return null;
        }
    };

    const isLastStep = currentStep === METADATA_STEPS.length;

    return (
        <FormProvider {...methods}>
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/course">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Link>
                </Button>
                {lastSaved && !isDirty && (
                    <span className="text-muted-foreground flex items-center text-sm">
                        <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                        Saved {lastSaved.toLocaleTimeString()}
                    </span>
                )}
                {isDirty && (
                    <span className="text-sm text-yellow-600">
                        Unsaved changes...
                    </span>
                )}
            </div>

            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-foreground text-2xl font-bold">
                        Create New Course
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Build and publish your course in a few simple steps
                    </p>
                </div>

                <PhaseIndicator phases={PHASES} currentPhase={1} />

                <Form {...methods}>
                    <form
                        className="space-y-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="min-h-125">{renderStepContent()}</div>

                        <div className="border-border bg-background/95 sticky bottom-0 z-10 flex items-center justify-between border-t py-4 pt-6 backdrop-blur">
                            <div className="flex items-center gap-3">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                        className="rounded-xl"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                        Previous
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    disabled={isSubmitting || !isDirty}
                                    className="rounded-xl"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Draft
                                </Button>
                                {!isLastStep ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="rounded-xl"
                                    >
                                        Next Step{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={handleCreateCourse}
                                        disabled={isSubmitting}
                                        className="rounded-xl"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                        )}
                                        Create Course & Continue
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </FormProvider>
    );
}
