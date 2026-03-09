'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Tag, TagInput } from 'emblor';
import {
    BookOpen,
    BarChart,
    Zap,
    Target,
    GripVertical,
    X,
    Plus,
    LinkIcon,
} from 'lucide-react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { COURSE_LEVELS } from '@/components/course-builder/constant';
import {
    CourseBasicInfoFormData,
    CourseInitFormData,
} from '@/lib/service/course';
import { fakeCourses } from '@constant/sample-data';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// legacy
function BasicInfoStep() {
    const { control, setValue, watch } =
        useFormContext<CourseBasicInfoFormData>();

    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    const currentTags = watch('category') || [];

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Course Title</CardTitle>
                    <CardDescription>
                        Write a clear, compelling title that describes what
                        students will learn
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Complete Web Development Bootcamp 2024"
                                        className="h-12 rounded-xl text-base"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-right">
                                    {field.value?.length || 0}/100 characters
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subtitle (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js and more"
                                        className="h-11 rounded-xl"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A brief summary that appears below the title
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                        Course Description
                    </CardTitle>
                    <CardDescription>
                        Describe what your course covers and why students should
                        enroll
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide a detailed description of your course..."
                                        className="min-h-40 resize-none rounded-xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-right">
                                    {field.value?.length || 0}/5000 characters
                                    (minimum 50)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Category & Level</CardTitle>
                    <CardDescription>
                        Help students find your course by choosing the right
                        topics and difficulty
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={control}
                            name="category"
                            render={() => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left">
                                        Topics
                                    </FormLabel>

                                    <FormControl>
                                        <TagInput
                                            placeholder="Enter a topic and press Enter"
                                            tags={currentTags}
                                            setTags={(newTags) => {
                                                setValue(
                                                    'category',
                                                    newTags as Tag[],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    },
                                                );
                                            }}
                                            activeTagIndex={activeTagIndex}
                                            setActiveTagIndex={
                                                setActiveTagIndex
                                            }
                                            className="border-input bg-background ring-offset-background focus-within:ring-primary flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 sm:min-w-112.5"
                                            styleClasses={{
                                                input: 'min-h-7 border-none bg-transparent shadow-none outline-none focus-visible:ring-0 px-3 py-0',
                                                inlineTagsContainer:
                                                    'p-0 gap-1',
                                            }}
                                        />
                                    </FormControl>

                                    <FormDescription>
                                        Press Enter to add a topic.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />{' '}
                    </div>

                    <FormField
                        control={control}
                        name="level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty Level</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
                                    >
                                        {COURSE_LEVELS.map((level) => {
                                            const Icon =
                                                level.value === 'beginner'
                                                    ? BookOpen
                                                    : level.value ===
                                                        'intermediate'
                                                      ? BarChart
                                                      : Zap;
                                            const isSelected =
                                                field.value === level.value;

                                            return (
                                                <Label
                                                    key={level.value}
                                                    htmlFor={level.value}
                                                    className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50'
                                                    }`}
                                                >
                                                    <RadioGroupItem
                                                        value={level.value}
                                                        id={level.value}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                                            isSelected
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p
                                                            className={`font-medium ${
                                                                isSelected
                                                                    ? 'text-primary'
                                                                    : 'text-foreground'
                                                            }`}
                                                        >
                                                            {level.label}
                                                        </p>
                                                        <p className="text-muted-foreground mt-1 text-xs">
                                                            {level.description}
                                                        </p>
                                                    </div>
                                                </Label>
                                            );
                                        })}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

// new
export function MetadataStep() {
    const {
        control,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<CourseInitFormData>();

    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const currentTags = watch('categories') || [];

    const {
        fields: objectiveFields,
        append: appendObjective,
        remove: removeObjective,
    } = useFieldArray({ control, name: 'learning_objectives' });

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
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                        Course Information
                    </CardTitle>
                    <CardDescription>
                        Give your course a compelling title and description.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Introduction to Calculus"
                                        className="h-12 rounded-xl text-base"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide a detailed description of your course..."
                                        className="min-h-32 resize-none rounded-xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Classification</CardTitle>
                    <CardDescription>
                        Help students find your course by choosing topics and
                        difficulty.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={control}
                        name="categories"
                        render={() => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel className="text-left">
                                    Topics
                                </FormLabel>
                                <FormControl>
                                    <TagInput
                                        placeholder="Enter a topic and press Enter"
                                        tags={currentTags}
                                        setTags={(newTags) => {
                                            setValue(
                                                'categories',
                                                newTags as Tag[],
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                },
                                            );
                                        }}
                                        activeTagIndex={activeTagIndex}
                                        setActiveTagIndex={setActiveTagIndex}
                                        className="border-input bg-background focus-within:ring-primary flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2"
                                        styleClasses={{
                                            input: 'min-h-7 border-none bg-transparent shadow-none outline-none focus-visible:ring-0 px-3 py-0',
                                            inlineTagsContainer: 'p-0 gap-1',
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty Level</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
                                    >
                                        {COURSE_LEVELS.map((level) => {
                                            const Icon =
                                                level.value === 'beginner'
                                                    ? BookOpen
                                                    : level.value ===
                                                        'intermediate'
                                                      ? BarChart
                                                      : Zap;
                                            const isSelected =
                                                field.value === level.value;

                                            return (
                                                <Label
                                                    key={level.value}
                                                    htmlFor={level.value}
                                                    className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50'
                                                    }`}
                                                >
                                                    <RadioGroupItem
                                                        value={level.value}
                                                        id={level.value}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p
                                                            className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}
                                                        >
                                                            {level.label}
                                                        </p>
                                                        <p className="text-muted-foreground mt-1 text-xs">
                                                            {level.description}
                                                        </p>
                                                    </div>
                                                </Label>
                                            );
                                        })}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="text-primary h-5 w-5" />
                        Learning Outcomes & Prerequisites
                    </CardTitle>
                    <CardDescription>
                        Define what students will learn and what they need to
                        know beforehand.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <FormLabel>Learning Objectives</FormLabel>
                        <div className="space-y-3">
                            {objectiveFields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={control}
                                    name={
                                        `learning_objectives.${index}.value` as const
                                    }
                                    render={({ field: inputField }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="group flex items-center gap-2">
                                                    <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
                                                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <Input
                                                        placeholder="e.g., Master the fundamentals of calculus"
                                                        className="h-11 flex-1 rounded-xl"
                                                        {...inputField}
                                                    />
                                                    {objectiveFields.length >
                                                        1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
                                                            onClick={() =>
                                                                removeObjective(
                                                                    index,
                                                                )
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
                            {errors.learning_objectives?.root && (
                                <p className="text-destructive pl-16 text-[0.8rem] font-medium">
                                    {errors.learning_objectives.root.message}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-2 w-full rounded-xl border-dashed bg-transparent"
                                onClick={() => appendObjective({ value: '' })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Objective
                            </Button>
                        </div>
                    </div>

                    <div className="border-border space-y-4 border-t pt-4">
                        <FormLabel className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" /> Prerequisites
                        </FormLabel>
                        <div className="space-y-3">
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
                                                onClick={() =>
                                                    removePrereq(index)
                                                }
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
                                        <SelectValue placeholder="Link a prerequisite course..." />
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
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
