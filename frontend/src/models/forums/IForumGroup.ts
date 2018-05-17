import IForumPost from './IForumPost';
import IForumThread from './IForumThread';
import { IForumTopic } from './IForumTopic';

export interface IForumGroupResponse {
    results: {
        id: number;
        name: string;
        sortOrder: number;
        topics: {
            id: number;
            group: number;
            sortOrder: number;
            name: string;
            description: string;
            minimumUserClass: number;
            numberOfThreads: number;
            numberOfPosts: number;
            latestPost?: {
                id: number;
                author: number;
                thread: number;
                threadTitle: string;
                createdAt: string; // Date
            }
        }[];
    }[];
}

export interface IForumGroup {
    id: number;
    title: string;
    topics?: number[];
}

export interface IForumGroupData {
    groups: IForumGroup[];
    topics: IForumTopic[];
    threads: IForumThread[];
    posts: IForumPost[];
    users: number[];
}

export default IForumGroup;