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
import { Button } from '@/components/ui/button';

import { COURSE_LEVELS } from '@/components/course-builder/constant';
import { CourseInitFormData } from '@/lib/service/course';

import { SortableList } from '@/components/ui/sortable-list';
import { CoursePrerequisiteSelect } from '@/components/course-prerequisite-select';

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
        move: moveObjective,
    } = useFieldArray({ control, name: 'learning_objectives' });

    const {
        fields: prereqFields,
        append: appendPrereq,
        remove: removePrereq,
    } = useFieldArray({ control, name: 'prerequisites' });

    const currentPrereqs = watch('prerequisites') || [];

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
                                                    className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
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
                            <SortableList
                                items={objectiveFields}
                                onReorder={(_, oldIndex, newIndex) => {
                                    moveObjective(oldIndex, newIndex);
                                }}
                                renderItem={(item, dragProps) => {
                                    const index = objectiveFields.findIndex(
                                        (f) => f.id === item.id,
                                    );
                                    return (
                                        <div className="group bg-background focus-within:border-primary/50 mb-2 flex items-center gap-3 rounded-xl border p-2 transition-all">
                                            <div
                                                {...dragProps}
                                                className="text-muted-foreground/30 hover:text-muted-foreground cursor-grab p-2 outline-none active:cursor-grabbing"
                                            >
                                                <GripVertical className="h-5 w-5" />
                                            </div>
                                            <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <FormField
                                                control={control}
                                                name={
                                                    `learning_objectives.${index}.value` as const
                                                }
                                                render={({ field }) => (
                                                    <Input
                                                        placeholder="e.g., Master the fundamentals of calculus"
                                                        className="h-10 flex-1 border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {objectiveFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100"
                                                    onClick={() =>
                                                        removeObjective(index)
                                                    }
                                                >
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        {errors.learning_objectives?.root && (
                            <p className="text-destructive pl-16 text-[0.8rem] font-medium">
                                {errors.learning_objectives.root.message}
                            </p>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-2 w-full rounded-xl border-dashed"
                            onClick={() => appendObjective({ value: '' })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Objective
                        </Button>
                    </div>

                    <div className="border-border space-y-4 border-t pt-6">
                        <FormLabel className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" /> Prerequisites
                        </FormLabel>
                        <div className="space-y-3">
                            {prereqFields.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {prereqFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="border-border bg-muted/30 flex items-center gap-3 rounded-xl border p-3"
                                        >
                                            <BookOpen className="text-primary h-4 w-4 shrink-0" />
                                            <span className="line-clamp-1 flex-1 text-sm font-medium">
                                                {field.course_title}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
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

                            <CoursePrerequisiteSelect
                                value=""
                                onChange={(val, title) => {
                                    if (
                                        val &&
                                        !currentPrereqs.some(
                                            (p) => p.course_id === val,
                                        )
                                    ) {
                                        appendPrereq({
                                            course_id: val,
                                            course_title:
                                                title || 'Unknown Course',
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
