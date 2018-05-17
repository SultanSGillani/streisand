import { IForumPost } from './IForumPost';
import { IForumThread } from './IForumThread';

export interface INewsPostResponse {
    author: number;
    id: number;
    body: string;
    createdAt: string; // Date
    modifiedAt: string; // Date
    modifiedBy: number;
    thread: number;
    threadTitle: string;
}

export interface INewsPostData {
    threads: IForumThread[];
    posts: IForumPost[];
    users: number[];
}