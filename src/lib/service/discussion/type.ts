import { User } from '../user';

export interface Comment {
    id: string;
    user_id: string;
    course_id: string;
    content: string;
    user?: User;
    replies?: Reply[];
    created_at: string;
    updated_at: string;
}

export interface Reply {
    id: string;
    comment_id: string;
    user_reply_id: string;
    content: string;
    user?: User;
    created_at: string;
    updated_at: string;
}
