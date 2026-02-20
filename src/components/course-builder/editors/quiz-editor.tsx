'use client';

import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle, Clock, Trophy, Plus, Trash2 } from 'lucide-react';

import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';

import {
    quizMaterialSchema,
    type QuizMaterialFormValues,
    type DraftLessonItem,
} from '@/lib/service/lesson';
import { generateId } from '@/lib/utils';

interface QuizEditorProps {
    initialData: DraftLessonItem | null;
    onSave: (data: QuizMaterialFormValues) => void;
    onCancel: () => void;
}

export function QuizEditor({ initialData, onSave, onCancel }: QuizEditorProps) {
    const form = useForm<QuizMaterialFormValues>({
        resolver: zodResolver(quizMaterialSchema),
        defaultValues: {
            title: initialData?.title || '',
            is_required: initialData?.is_required ?? true,
            is_preview: initialData?.is_preview ?? false,
            description: initialData?.quiz_data?.description || '',
            time_limit_minutes:
                initialData?.quiz_data?.time_limit_minutes || 15,
            passing_score: initialData?.quiz_data?.passing_score || 80,
            questions: initialData?.quiz_data?.questions?.length
                ? initialData.quiz_data.questions
                : [
                      {
                          id: generateId('q'),
                          title: '',
                          question_type: 'single',
                          score: 1,
                          answers: [
                              {
                                  id: generateId('a'),
                                  content: '',
                                  is_correct: true,
                              },
                              {
                                  id: generateId('a'),
                                  content: '',
                                  is_correct: false,
                              },
                          ],
                      },
                  ],
        },
    });

    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
    } = useFieldArray({
        control: form.control,
        name: 'questions',
    });

    const handleAddQuestion = () => {
        appendQuestion({
            id: generateId('q'),
            title: '',
            question_type: 'single',
            score: 1,
            answers: [
                { id: generateId('a'), content: 'Option 1', is_correct: true },
                { id: generateId('a'), content: 'Option 2', is_correct: false },
            ],
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
                <div className="bg-muted/20 border-border space-y-4 rounded-xl border p-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quiz Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Module 1 Final Assessment"
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
                                    <FormLabel className="font-normal">
                                        Required to pass
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-primary flex items-center gap-2 text-sm font-medium">
                        <HelpCircle className="h-4 w-4" /> Rules & Configuration
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        className="w-full"
                                        editorContentClassName="p-4 min-h-[120px]"
                                        output="html"
                                        placeholder="What should students know before starting?"
                                        autofocus={false}
                                        editable={true}
                                        editorClassName="focus:outline-none bg-background"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="time_limit_minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" /> Time
                                        Limit (mins)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passing_score"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Trophy className="h-3.5 w-3.5" />{' '}
                                        Passing Score (%)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            max={100}
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="border-border space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            Questions ({questionFields.length})
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleAddQuestion}
                            className="rounded-xl"
                        >
                            <Plus className="mr-1.5 h-4 w-4" /> Add Question
                        </Button>
                    </div>

                    {form.formState.errors.questions?.message && (
                        <p className="text-destructive text-sm font-medium">
                            {form.formState.errors.questions.message}
                        </p>
                    )}

                    <Accordion
                        type="multiple"
                        defaultValue={questionFields.map((_, i) => `q-${i}`)}
                        className="space-y-4"
                    >
                        {questionFields.map((field, index) => (
                            <QuestionItem
                                key={field.id}
                                index={index}
                                form={form}
                                onRemove={() => removeQuestion(index)}
                            />
                        ))}
                    </Accordion>
                </div>

                <div className="border-border mt-8 flex justify-end gap-3 border-t pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl">
                        Save Quiz
                    </Button>
                </div>
            </form>
        </Form>
    );
}

interface QuestionItemProps {
    index: number;
    form: UseFormReturn<QuizMaterialFormValues>;
    onRemove: () => void;
}

function QuestionItem({ index, form, onRemove }: QuestionItemProps) {
    const {
        fields: answerFields,
        append: appendAnswer,
        remove: removeAnswer,
    } = useFieldArray({
        control: form.control,
        name: `questions.${index}.answers`,
    });

    const qType = form.watch(`questions.${index}.question_type`);

    const handleCorrectToggle = (answerIndex: number, isChecked: boolean) => {
        if (qType === 'single' || qType === 'true_false') {
            if (isChecked) {
                answerFields.forEach((_, i) => {
                    form.setValue(
                        `questions.${index}.answers.${i}.is_correct`,
                        i === answerIndex,
                        { shouldValidate: true },
                    );
                });
            } else {
                form.setValue(
                    `questions.${index}.answers.${answerIndex}.is_correct`,
                    false,
                    { shouldValidate: true },
                );
            }
        } else {
            form.setValue(
                `questions.${index}.answers.${answerIndex}.is_correct`,
                isChecked,
                { shouldValidate: true },
            );
        }
    };

    return (
        <AccordionItem
            value={`q-${index}`}
            className="bg-card border-border overflow-hidden rounded-xl border px-1 shadow-sm"
        >
            <AccordionTrigger className="bg-muted/10 px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded text-xs font-bold">
                        {index + 1}
                    </div>
                    <span className="text-sm font-medium">
                        {form.watch(`questions.${index}.title`) ||
                            'New Question'}
                    </span>
                </div>
            </AccordionTrigger>

            <AccordionContent className="border-border space-y-5 border-t p-4 pt-2">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-destructive hover:bg-destructive/10 h-8"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        Question
                    </Button>
                </div>

                <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
                    <FormField
                        control={form.control}
                        name={`questions.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Text</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="What is 1 + 1?"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`questions.${index}.question_type`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        if (val === 'true_false') {
                                            form.setValue(
                                                `questions.${index}.answers`,
                                                [
                                                    {
                                                        id: generateId('a'),
                                                        content: 'True',
                                                        is_correct: true,
                                                    },
                                                    {
                                                        id: generateId('a'),
                                                        content: 'False',
                                                        is_correct: false,
                                                    },
                                                ],
                                            );
                                        }
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="z-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-200">
                                        <SelectItem value="single">
                                            Single Choice
                                        </SelectItem>
                                        <SelectItem value="multiple">
                                            Multiple Choice
                                        </SelectItem>
                                        <SelectItem value="true_false">
                                            True / False
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`questions.${index}.score`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-muted/20 border-border space-y-3 rounded-lg border p-4">
                    <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Answers Options
                    </FormLabel>

                    {form.formState.errors.questions?.[index]?.answers
                        ?.message && (
                        <p className="text-destructive text-xs">
                            {
                                form.formState.errors.questions[index]?.answers
                                    ?.message
                            }
                        </p>
                    )}

                    <div className="space-y-2">
                        {answerFields.map((answerField, aIndex) => (
                            <div
                                key={answerField.id}
                                className="bg-background border-border group flex items-start gap-3 rounded-md border p-2"
                            >
                                <div className="pt-2.5 pl-2">
                                    <FormField
                                        control={form.control}
                                        name={`questions.${index}.answers.${aIndex}.is_correct`}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) =>
                                                    handleCorrectToggle(
                                                        aIndex,
                                                        checked === true,
                                                    )
                                                }
                                                className="h-5 w-5 rounded-full data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                                            />
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`questions.${index}.answers.${aIndex}.content`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-0">
                                            <FormControl>
                                                <Input
                                                    placeholder={`Option ${aIndex + 1}`}
                                                    className={`border-transparent shadow-none focus-visible:ring-0 ${form.watch(`questions.${index}.answers.${aIndex}.is_correct`) ? 'font-medium text-green-600' : ''}`}
                                                    readOnly={
                                                        qType === 'true_false'
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {qType !== 'true_false' && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAnswer(aIndex)}
                                        className="text-muted-foreground hover:text-destructive mt-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {qType !== 'true_false' && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                appendAnswer({
                                    id: generateId('a'),
                                    content: '',
                                    is_correct: false,
                                })
                            }
                            className="text-primary hover:text-primary hover:bg-primary/10 mt-2 h-7 text-xs"
                        >
                            <Plus className="mr-1 h-3 w-3" /> Add Option
                        </Button>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name={`questions.${index}.explanation`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Explanation (Optional)</FormLabel>
                            <FormControl>
                                <MinimalTiptapEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    className="w-full"
                                    editorContentClassName="p-3 min-h-[100px]"
                                    output="html"
                                    placeholder="Explain why this answer is correct..."
                                    autofocus={false}
                                    editable={true}
                                    editorClassName="focus:outline-none bg-background"
                                />
                            </FormControl>
                            <FormDescription className="text-xs">
                                Shown to students after they complete the quiz.
                            </FormDescription>
                        </FormItem>
                    )}
                />
            </AccordionContent>
        </AccordionItem>
    );
}
