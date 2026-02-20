'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tag, TagInput } from 'emblor';
import { BookOpen, BarChart, Zap } from 'lucide-react';

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
import { CourseBasicInfoFormData } from '@/lib/service/course';

export function BasicInfoStep() {
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
