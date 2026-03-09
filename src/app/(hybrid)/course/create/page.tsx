'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, Loader2, Rocket } from 'lucide-react';
import Link from 'next/link';

import { PhaseIndicator } from '@/components/course-builder/phase-indicator';
import {
    courseInitSchema,
    type CourseInitFormData,
    defaultInitData,
} from '@/lib/service/course';
import { RoleGuard } from '@/components/layout/role-gaurd';

import { MetadataStep } from '@/components/course-builder/steps/basic-info-step';
import { PricingStep } from '@/components/course-builder/steps/pricing-step';

export default function CreateCoursePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<CourseInitFormData>({
        resolver: zodResolver(courseInitSchema),
        defaultValues: defaultInitData,
        mode: 'onChange',
    });

    const { trigger, handleSubmit } = methods;

    const handleNext = async () => {
        const isStep1Valid = await trigger([
            'title',
            'description',
            'level',
            'categories',
            'learning_objectives',
            'prerequisites',
        ]);

        if (isStep1Valid) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const processPayloadForBackend = (data: CourseInitFormData) => {
        return {
            title: data.title,
            description: data.description,
            level: data.level,
            price: data.is_free ? 0 : data.price,
            categories: data.categories.map((cat) => cat.text),
            learning_objectives: data.learning_objectives
                .map((obj) => obj.value)
                .filter((val) => val.trim() !== ''),
            prerequisites: data.prerequisites
                ? data.prerequisites.map((pre) => pre.course_id)
                : [],
        };
    };

    const onSubmit = async (data: CourseInitFormData) => {
        setIsSubmitting(true);
        try {
            const finalPayload = processPayloadForBackend(data);

            console.log('Payload', JSON.stringify(finalPayload, null, 2));

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const fakeCourseId = `course-${Date.now()}`;
            router.push(`/dashboard/courses/${fakeCourseId}/overview`);
        } catch (error) {
            console.error('Failed to create course:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <RoleGuard allowedRoles={['instructor', 'admin']}>
            <FormProvider {...methods}>
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href="/course">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Courses
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
                            Start your journey
                        </h1>
                        <p className="text-primary/80 mt-2 font-medium">
                            Just a few basic details to lay the foundation. You
                            can add more content later.
                        </p>
                    </div>

                    <Form {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="min-h-125">
                                {currentStep === 1 && <MetadataStep />}
                                {currentStep === 2 && <PricingStep />}
                            </div>

                            <div className="border-border bg-background/95 sticky bottom-0 z-10 flex items-center justify-between border-t py-4 pt-6 backdrop-blur">
                                <div>
                                    {currentStep === 2 && (
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

                                <div>
                                    {currentStep === 1 ? (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                        >
                                            Next Step{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Rocket className="mr-2 h-4 w-4" />
                                            )}
                                            Create Course
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </FormProvider>
        </RoleGuard>
    );
}
