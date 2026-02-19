'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Target,
    Plus,
    X,
    BookOpen,
    Users,
    CheckCircle,
    Link as LinkIcon,
    GripVertical,
} from 'lucide-react';

import { fakeCourses } from '@/lib/fake-data';
import { CourseGoalsFormData } from '@/lib/service/course';

export function GoalsStep() {
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext<CourseGoalsFormData>();

    const {
        fields: objectiveFields,
        append: appendObjective,
        remove: removeObjective,
    } = useFieldArray({ control, name: 'learning_objectives' as never });

    const {
        fields: requirementFields,
        append: appendRequirement,
        remove: removeRequirement,
    } = useFieldArray({ control, name: 'requirements' as never });

    const {
        fields: audienceFields,
        append: appendAudience,
        remove: removeAudience,
    } = useFieldArray({ control, name: 'target_audience' as never });

    const {
        fields: prereqFields,
        append: appendPrereq,
        remove: removePrereq,
    } = useFieldArray({ control, name: 'prerequisites' });

    const currentPrereqs = watch('prerequisites') || [];
    const availableCourses = fakeCourses.filter(
        (c) =>
            c.status === 'published' &&
            !currentPrereqs.some((p) => p.course_id === c.id),
    );

    const handleAddPrerequisite = (courseId: string) => {
        const course = fakeCourses.find((c) => c.id === courseId);
        if (course) {
            appendPrereq({ course_id: course.id, course_title: course.title });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="text-primary h-5 w-5" />
                        Learning Objectives
                    </CardTitle>
                    <CardDescription>
                        What will students be able to do after completing your
                        course? (Minimum 3)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {objectiveFields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={control}
                            name={`learning_objectives.${index}` as const}
                            render={({ field: inputField }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="group flex items-center gap-2">
                                            <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
                                            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                            <Input
                                                placeholder="e.g., Build responsive websites using HTML, CSS, and JavaScript"
                                                className="h-11 flex-1 rounded-xl"
                                                {...inputField}
                                            />
                                            {objectiveFields.length > 3 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
                                                    onClick={() =>
                                                        removeObjective(index)
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </FormControl>
                                    <div className="pl-16">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    ))}
                    {errors.learning_objectives &&
                        'message' in errors.learning_objectives && (
                            <p className="text-destructive pl-16 text-[0.8rem] font-medium">
                                {errors.learning_objectives.message as string}
                            </p>
                        )}
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2 w-full rounded-xl border-dashed bg-transparent"
                        onClick={() => appendObjective('')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Objective
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <LinkIcon className="text-primary h-5 w-5" />
                        Prerequisites (Optional)
                    </CardTitle>
                    <CardDescription>
                        Link courses that students should complete before taking
                        this course
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {prereqFields.length > 0 && (
                        <div className="space-y-2">
                            {prereqFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="border-border bg-muted/30 flex items-center gap-3 rounded-xl border p-3"
                                >
                                    <BookOpen className="text-primary h-4 w-4" />
                                    <span className="flex-1 text-sm font-medium">
                                        {field.course_title}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive h-8"
                                        onClick={() => removePrereq(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {availableCourses.length > 0 ? (
                        <Select onValueChange={handleAddPrerequisite}>
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select a prerequisite course..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {availableCourses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="text-muted-foreground rounded-xl border border-dashed py-4 text-center text-sm">
                            {prereqFields.length === 0
                                ? 'No courses available to link.'
                                : 'All available courses are linked.'}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="text-primary h-5 w-5" />
                        Requirements (Optional)
                    </CardTitle>
                    <CardDescription>
                        What tools, software, or prior knowledge do students
                        need?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {requirementFields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={control}
                            name={`requirements.${index}` as const}
                            render={({ field: inputField }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="group flex items-center gap-2">
                                            <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
                                            <Input
                                                placeholder="e.g., Basic knowledge of HTML and CSS"
                                                className="h-11 flex-1 rounded-xl"
                                                {...inputField}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
                                                onClick={() =>
                                                    removeRequirement(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <div className="pl-6">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-dashed bg-transparent"
                        onClick={() => appendRequirement('')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Requirement
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="text-primary h-5 w-5" />
                        Target Audience
                    </CardTitle>
                    <CardDescription>
                        Who is this course designed for?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {audienceFields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={control}
                            name={`target_audience.${index}` as const}
                            render={({ field: inputField }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="group flex items-center gap-2">
                                            <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
                                            <Input
                                                placeholder="e.g., Web developers looking to learn React"
                                                className="h-11 flex-1 rounded-xl"
                                                {...inputField}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
                                                onClick={() =>
                                                    removeAudience(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <div className="pl-6">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-dashed bg-transparent"
                        onClick={() => appendAudience('')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Target Audience
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
