
export interface ISingleForumThreadResponse {
    topic: number;
    id: number;
    title: string;
    createdBy: number;
    modifiedAt: string; // Date
    modifiedBy: number;
}

export interface IForumThreadResponse {
    groups: {
        id: number;
        name: string;
    };
    topics: {
        id: number;
        group: number;
        name: string;
    };
    id: number;
    title: string;
    topic: number;
    isLocked: boolean;
    isSticky: boolean;
    createdAt: string; // Date
    createdBy: number;
    numberOfPosts: number;
}

export interface IForumThreadPostsResponse extends IForumThreadResponse {
    posts: {
        count: number;
        results: {
            id: number;
            thread: number;
            topic: number;
            author: number;
            createdAt: string; // Date
            body: string;
            modifiedAt: string; // Date
            modifiedBy: number;
        }[];
    };
}

export interface IForumThread {
    id: number;
    title: string;
    topic?: number;
    createdAt?: string; // Date
    createdBy?: number;
    isLocked?: boolean;
    isSticky?: boolean;
    numberOfPosts?: number;
    latestPost?: number;
}

export default IForumThread;