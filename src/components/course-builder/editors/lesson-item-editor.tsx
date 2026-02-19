'use client';

import { UseFormReturn } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, Eye, CheckCircle } from 'lucide-react';
import type { CourseModuleFormData, LessonItem } from '@/lib/schemas/course';
import { VideoEditor } from './video-editor';
import { ReadingEditor } from './reading-editor';
import { QuizEditor } from './quiz-editor';
import { CodingEditor } from './coding-editor';
import { FileEditor } from './file-editor';

interface LessonItemEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    moduleIndex: number;
    lessonIndex: number;
    itemIndex: number;
    onClose: () => void;
}

export function LessonItemEditor({
    form,
    moduleIndex,
    lessonIndex,
    itemIndex,
    onClose,
}: LessonItemEditorProps) {
    const basePath =
        `modules.${moduleIndex}.lessons.${lessonIndex}.items.${itemIndex}` as const;
    const item = form.watch(
        `modules.${moduleIndex}.lessons.${lessonIndex}.items.${itemIndex}`,
    );

    if (!item) return null;

    const renderContentEditor = () => {
        switch (item.item_type) {
            case 'video':
                return (
                    <VideoEditor form={form} basePath={`${basePath}.video`} />
                );
            case 'reading':
                return (
                    <ReadingEditor
                        form={form}
                        basePath={`${basePath}.reading`}
                    />
                );
            case 'quiz':
                return <QuizEditor form={form} basePath={`${basePath}.quiz`} />;
            case 'coding':
                return (
                    <CodingEditor form={form} basePath={`${basePath}.coding`} />
                );
            case 'file':
                return <FileEditor form={form} basePath={`${basePath}.file`} />;
            default:
                return null;
        }
    };

    return (
        <Card className="border-border rounded-xl shadow-sm">
            <CardContent className="space-y-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-sm font-medium">
                        Edit Content
                    </h4>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Title */}
                <FormField
                    control={form.control}
                    name={
                        `${basePath}.title` as `modules.${number}.lessons.${number}.items.${number}.title`
                    }
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter item title"
                                    className="h-10 rounded-lg"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Options */}
                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name={
                            `${basePath}.is_preview` as `modules.${number}.lessons.${number}.items.${number}.is_preview`
                        }
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`${basePath}-preview`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    htmlFor={`${basePath}-preview`}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Free Preview
                                </Label>
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={
                            `${basePath}.is_required` as `modules.${number}.lessons.${number}.items.${number}.is_required`
                        }
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`${basePath}-required`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    htmlFor={`${basePath}-required`}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm"
                                >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Required
                                </Label>
                            </div>
                        )}
                    />
                </div>

                <Separator />

                {/* Content-specific editor */}
                {renderContentEditor()}

                {/* Actions */}
                <div className="flex justify-end pt-2">
                    <Button
                        type="button"
                        size="sm"
                        className="rounded-lg"
                        onClick={onClose}
                    >
                        Done
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
