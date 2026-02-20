'use client';

import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Code, Trophy, Calendar } from 'lucide-react';

import { CodeEditor } from '@/components/ui/code-editor';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

import {
    codingMaterialSchema,
    type CodingMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';
import { CODE_BOILERPLATES, LANGUAGES } from '../constant';

interface CodingEditorProps {
    initialData: DraftLessonItem | null;
    onSave: (data: CodingMaterialFormValues) => void;
    onCancel: () => void;
}

export function CodingEditor({
    initialData,
    onSave,
    onCancel,
}: CodingEditorProps) {
    const isFirstMount = useRef(true);

    const form = useForm<CodingMaterialFormValues>({
        resolver: zodResolver(codingMaterialSchema),
        defaultValues: {
            title: initialData?.title || '',
            is_required: initialData?.is_required ?? true,
            is_preview: initialData?.is_preview ?? false,
            description: initialData?.coding_data?.description || '',
            instructions: initialData?.coding_data?.instructions || '',
            starter_code: initialData?.coding_data?.starter_code || '',
            language: initialData?.coding_data?.language || 'javascript',
            max_score: initialData?.coding_data?.max_score || 100,
            due_days: initialData?.coding_data?.due_days || 7,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                is_required: initialData.is_required,
                is_preview: initialData.is_preview,
                ...initialData.coding_data,
            });
        }
    }, [initialData, form]);

    const selectedLanguage = useWatch({
        control: form.control,
        name: 'language',
    });

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            if (!initialData?.coding_data?.starter_code) {
                form.setValue(
                    'starter_code',
                    CODE_BOILERPLATES[selectedLanguage] || '',
                );
            }
            return;
        }

        const currentCode = form.getValues('starter_code');
        const isCodeEmptyOrBoilerplate =
            !currentCode ||
            Object.values(CODE_BOILERPLATES).includes(currentCode);

        if (selectedLanguage && isCodeEmptyOrBoilerplate) {
            const newBoilerplate = CODE_BOILERPLATES[selectedLanguage] || '';
            form.setValue('starter_code', newBoilerplate, {
                shouldValidate: true,
            });
        }
    }, [selectedLanguage, form, initialData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="bg-muted/30 border-border space-y-4 rounded-xl border p-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assignment Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Two Sum Problem"
                                        className="bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-6 pt-2">
                        <FormField
                            control={form.control}
                            name="is_required"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Required to complete
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_preview"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Free preview
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                        <Code className="h-4 w-4" /> Assignment Details
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Language</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-lg">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-200 rounded-xl">
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem
                                                    key={lang.value}
                                                    value={lang.value}
                                                >
                                                    {lang.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="max_score"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Trophy className="h-3.5 w-3.5" /> Max
                                        Score
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="rounded-lg"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Brief overview of the problem..."
                                        className="h-16 resize-none rounded-lg"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detailed Instructions</FormLabel>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        className="w-full"
                                        editorContentClassName="p-5 min-h-[250px]"
                                        output="html"
                                        placeholder="Describe the problem, input/output constraints, and examples..."
                                        autofocus={false}
                                        editable={true}
                                        editorClassName="focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="starter_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        Starter Code{' '}
                                    </span>
                                    <span className="text-muted-foreground text-xs font-normal">
                                        Students will see this when they open
                                        the assignment
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <div className="border-border overflow-hidden rounded-xl border">
                                        <CodeEditor
                                            language={selectedLanguage}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            height="350px"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="due_days"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" /> Days to
                                    Complete
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        className="w-32 rounded-lg"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Days students have to submit after
                                    unlocking.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="border-border flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl">
                        Save Assignment
                    </Button>
                </div>
            </form>
        </Form>
    );
}
