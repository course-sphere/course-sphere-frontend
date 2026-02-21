export type QuestionType = 'single' | 'multiple' | 'true_false';

export interface Quiz {
    id: string;
    title: string;
    time_limit_minutes: number;
    passing_score: number;
    questions?: Question[];
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: string;
    quiz_id: string;
    title: string;
    content: string;
    question_type: QuestionType;
    score: number;
    explanation?: string;
    answers?: QuestionAnswer[];
    created_at: string;
}

export interface QuestionAnswer {
    id: string;
    question_id: string;
    content: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
}
