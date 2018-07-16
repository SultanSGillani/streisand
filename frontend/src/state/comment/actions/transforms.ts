
import IUser from '../../../models/IUser';
import { ICommentResponse, IComment } from '../../../models/IComment';

export interface ICommentInfo {
    comment: IComment;
    users: IUser[];
}

export function transformComment(response: ICommentResponse): ICommentInfo {
    const users: IUser[] = [];
    const { author, text, ...comment } = response;
    users.push(author);
    return {
        users,
        comment: {
            ...comment,
            body: text,
            author: author.id
        }
    };
}

export interface ICommentsInfo {
    comments: IComment[];
    users: IUser[];
}

export function transformComments(response: ICommentResponse[]): ICommentsInfo {
    const users: IUser[] = [];
    const comments: IComment[] = [];
    for (const raw of response) {
        const { author, text, ...comment } = raw;
        users.push(author);
        comments.push({
            ...comment,
            body: text,
            author: author.id
        });
    }
    return { users, comments };
}