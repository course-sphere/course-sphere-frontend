'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import {
    HelpCircle,
    Clock,
    Trophy,
    Plus,
    Trash2,
    GripVertical,
    CheckCircle,
    Circle,
    AlertTriangle,
    ChevronDown,
} from 'lucide-react';
import type { CourseModuleFormData, Question } from '@/lib/schemas/course';
import { createEmptyQuestion, generateId } from '@/lib/schemas/course';

interface QuizEditorProps {
    form: UseFormReturn<CourseModuleFormData>;
    basePath: string;
}

const QUESTION_TYPES = [
    {
        value: 'single',
        label: 'Single Choice',
        description: 'One correct answer',
    },
    {
        value: 'multiple',
        label: 'Multiple Choice',
        description: 'Multiple correct answers',
    },
    { value: 'true_false', label: 'True/False', description: 'Binary choice' },
];

export function QuizEditor({ form, basePath }: QuizEditorProps) {
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

    const questions =
        (form.watch(`${basePath}.questions` as never) as Question[]) || [];

    const addQuestion = () => {
        const newQuestion = createEmptyQuestion(questions.length + 1);
        form.setValue(
            `${basePath}.questions` as never,
            [...questions, newQuestion] as never,
        );
        setExpandedQuestions([...expandedQuestions, newQuestion.id]);
    };

    const removeQuestion = (index: number) => {
        const updated = questions.filter((_, i) => i !== index);
        form.setValue(`${basePath}.questions` as never, updated as never);
    };

    const addAnswer = (questionIndex: number) => {
        const question = questions[questionIndex];
        const newAnswer = {
            id: generateId('answer'),
            content: `Option ${String.fromCharCode(65 + question.answers.length)}`,
            is_correct: false,
        };
        form.setValue(
            `${basePath}.questions.${questionIndex}.answers` as never,
            [...question.answers, newAnswer] as never,
        );
    };

    const removeAnswer = (questionIndex: number, answerIndex: number) => {
        const question = questions[questionIndex];
        const updated = question.answers.filter((_, i) => i !== answerIndex);
        form.setValue(
            `${basePath}.questions.${questionIndex}.answers` as never,
            updated as never,
        );
    };

    const toggleCorrectAnswer = (
        questionIndex: number,
        answerIndex: number,
    ) => {
        const question = questions[questionIndex];
        const answers = [...question.answers];

        if (
            question.question_type === 'single' ||
            question.question_type === 'true_false'
        ) {
            // For single choice, unset all others
            answers.forEach((a, i) => {
                a.is_correct = i === answerIndex;
            });
        } else {
            // For multiple choice, toggle
            answers[answerIndex].is_correct = !answers[answerIndex].is_correct;
        }

        form.setValue(
            `${basePath}.questions.${questionIndex}.answers` as never,
            answers as never,
        );
    };

    const getTotalScore = () => {
        return questions.reduce((acc, q) => acc + (q.score || 1), 0);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-500">
                <HelpCircle className="h-4 w-4" />
                Quiz Settings
            </div>

            {/* Quiz Settings */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`${basePath}.time_limit_minutes` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Time Limit (minutes)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    className="h-10 rounded-lg"
                                    {...field}
                                    value={(field.value as number) || 30}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`${basePath}.passing_score` as never}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                                <Trophy className="h-3.5 w-3.5" />
                                Passing Score (%)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="70"
                                    className="h-10 rounded-lg"
                                    {...field}
                                    value={(field.value as number) || 70}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
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
                name={`${basePath}.description` as never}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Brief instructions for students taking this quiz..."
                                className="min-h-16 resize-none rounded-lg"
                                {...field}
                                value={(field.value as string) || ''}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Questions List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium">Questions</h4>
                        <p className="text-muted-foreground text-xs">
                            {questions.length} question
                            {questions.length !== 1 ? 's' : ''} (
                            {getTotalScore()} points total)
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg bg-transparent"
                        onClick={addQuestion}
                    >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Question
                    </Button>
                </div>

                {questions.length === 0 ? (
                    <div className="border-border rounded-lg border border-dashed p-6 text-center">
                        <HelpCircle className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                        <p className="text-muted-foreground mb-3 text-sm">
                            No questions yet. Add your first question to get
                            started.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg bg-transparent"
                            onClick={addQuestion}
                        >
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Add Question
                        </Button>
                    </div>
                ) : (
                    <Accordion
                        type="multiple"
                        value={expandedQuestions}
                        onValueChange={setExpandedQuestions}
                        className="space-y-2"
                    >
                        {questions.map((question, questionIndex) => {
                            const hasCorrectAnswer = question.answers.some(
                                (a) => a.is_correct,
                            );

                            return (
                                <AccordionItem
                                    key={question.id}
                                    value={question.id}
                                    className="border-border overflow-hidden rounded-lg border"
                                >
                                    <AccordionTrigger className="[&[data-state=open]]:bg-muted/50 px-3 py-2 hover:no-underline">
                                        <div className="flex flex-1 items-center gap-2">
                                            <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
                                            <Badge
                                                variant="secondary"
                                                className="rounded text-xs"
                                            >
                                                Q{questionIndex + 1}
                                            </Badge>
                                            <span className="flex-1 truncate text-left text-sm font-medium">
                                                {question.title ||
                                                    `Question ${questionIndex + 1}`}
                                            </span>
                                            {!hasCorrectAnswer && (
                                                <Badge
                                                    variant="destructive"
                                                    className="rounded text-xs"
                                                >
                                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                                    No correct answer
                                                </Badge>
                                            )}
                                            <Badge
                                                variant="outline"
                                                className="rounded text-xs"
                                            >
                                                {question.score || 1} pt
                                                {question.score !== 1
                                                    ? 's'
                                                    : ''}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-3 pt-0 pb-3">
                                        <div className="border-border space-y-4 border-t pt-3">
                                            {/* Question Title */}
                                            <FormField
                                                control={form.control}
                                                name={
                                                    `${basePath}.questions.${questionIndex}.title` as never
                                                }
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Question
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your question..."
                                                                className="h-10 rounded-lg"
                                                                {...field}
                                                                value={
                                                                    (field.value as string) ||
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Question Type & Score */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={
                                                        `${basePath}.questions.${questionIndex}.question_type` as never
                                                    }
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Question Type
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={(
                                                                    value,
                                                                ) => {
                                                                    field.onChange(
                                                                        value,
                                                                    );
                                                                    // Reset answers for true/false
                                                                    if (
                                                                        value ===
                                                                        'true_false'
                                                                    ) {
                                                                        form.setValue(
                                                                            `${basePath}.questions.${questionIndex}.answers` as never,
                                                                            [
                                                                                {
                                                                                    id: generateId(
                                                                                        'answer',
                                                                                    ),
                                                                                    content:
                                                                                        'True',
                                                                                    is_correct: true,
                                                                                },
                                                                                {
                                                                                    id: generateId(
                                                                                        'answer',
                                                                                    ),
                                                                                    content:
                                                                                        'False',
                                                                                    is_correct: false,
                                                                                },
                                                                            ] as never,
                                                                        );
                                                                    }
                                                                }}
                                                                value={
                                                                    (field.value as string) ||
                                                                    'single'
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-10 rounded-lg">
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="rounded-xl">
                                                                    {QUESTION_TYPES.map(
                                                                        (
                                                                            type,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    type.value
                                                                                }
                                                                                value={
                                                                                    type.value
                                                                                }
                                                                            >
                                                                                <div>
                                                                                    <span>
                                                                                        {
                                                                                            type.label
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-muted-foreground ml-2 text-xs">
                                                                                        (
                                                                                        {
                                                                                            type.description
                                                                                        }

                                                                                        )
                                                                                    </span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={
                                                        `${basePath}.questions.${questionIndex}.score` as never
                                                    }
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Points
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="1"
                                                                    className="h-10 rounded-lg"
                                                                    {...field}
                                                                    value={
                                                                        (field.value as number) ||
                                                                        1
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        field.onChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Answers */}
                                            <div className="space-y-2">
                                                <Label className="text-sm">
                                                    Answers
                                                    {question.question_type ===
                                                        'multiple' && (
                                                            <span className="text-muted-foreground ml-1 text-xs">
                                                                (Select all correct
                                                                answers)
                                                            </span>
                                                        )}
                                                </Label>

                                                {question.answers.map(
                                                    (answer, answerIndex) => (
                                                        <div
                                                            key={answer.id}
                                                            className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${answer.is_correct
                                                                    ? 'border-green-500 bg-green-500/5'
                                                                    : 'border-border'
                                                                }`}
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 p-0"
                                                                onClick={() =>
                                                                    toggleCorrectAnswer(
                                                                        questionIndex,
                                                                        answerIndex,
                                                                    )
                                                                }
                                                            >
                                                                {question.question_type ===
                                                                    'multiple' ? (
                                                                    answer.is_correct ? (
                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                    ) : (
                                                                        <Circle className="text-muted-foreground h-4 w-4" />
                                                                    )
                                                                ) : answer.is_correct ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <Circle className="text-muted-foreground h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Input
                                                                placeholder={`Option ${String.fromCharCode(65 + answerIndex)}`}
                                                                className="h-8 flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
                                                                value={
                                                                    answer.content
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const answers =
                                                                        [
                                                                            ...question.answers,
                                                                        ];
                                                                    answers[
                                                                        answerIndex
                                                                    ].content =
                                                                        e.target.value;
                                                                    form.setValue(
                                                                        `${basePath}.questions.${questionIndex}.answers` as never,
                                                                        answers as never,
                                                                    );
                                                                }}
                                                                disabled={
                                                                    question.question_type ===
                                                                    'true_false'
                                                                }
                                                            />
                                                            {question.question_type !==
                                                                'true_false' &&
                                                                question.answers
                                                                    .length >
                                                                2 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                                                                        onClick={() =>
                                                                            removeAnswer(
                                                                                questionIndex,
                                                                                answerIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    ),
                                                )}

                                                {question.question_type !==
                                                    'true_false' && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-primary h-8"
                                                            onClick={() =>
                                                                addAnswer(
                                                                    questionIndex,
                                                                )
                                                            }
                                                        >
                                                            <Plus className="mr-1 h-3.5 w-3.5" />
                                                            Add Answer
                                                        </Button>
                                                    )}
                                            </div>

                                            {/* Explanation */}
                                            <FormField
                                                control={form.control}
                                                name={
                                                    `${basePath}.questions.${questionIndex}.explanation` as never
                                                }
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Explanation
                                                            (Optional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Explain why the correct answer is correct..."
                                                                className="min-h-16 resize-none rounded-lg"
                                                                {...field}
                                                                value={
                                                                    (field.value as string) ||
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Shown to students
                                                            after they submit
                                                            their answer
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Delete Question */}
                                            <div className="border-border flex justify-end border-t pt-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        removeQuestion(
                                                            questionIndex,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                                    Delete Question
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </div>
        </div>
    );
}
