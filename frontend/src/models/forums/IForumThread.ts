
export interface IForumThreadResponse {
    groupId: number;
    groupName: string;
    topic: number;
    topicTitle: string;
    id: number;
    title: string;
    createdAt: string; // Date
    createdById: number;
    createdByUsername: string;
    isLocked: boolean;
    isSticky: boolean;
    numberOfPosts: number;
    latestPost: number;
    latestPostCreatedAt: string; // Date
    latestPostAuthorId: number;
    latestPostAuthorUsername: string;
}

export interface IForumThread {
    id: number;
    title: string;
    topic: number;
    createdAt?: string; // Date
    createdBy?: number;
    isLocked?: boolean;
    isSticky?: boolean;
    numberOfPosts?: number;
    latestPost?: number;
    posts?: number[];
}

export default IForumThread;