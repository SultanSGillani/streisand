
export interface IForumTopicResponse {
    id: number;
    sortOrder: number;
    name: string;
    description: string;
    minimumUserClass: number;
    numberOfThreads: number;
    numberOfPosts: number;
    latestPostId: number;
    latestPostCreatedAt: string; // Date
    latestPostAuthorId: number;
    latestPostAuthorName: string;
    latestPostThreadId: number;
    latestPostThreadTitle: string;
}

export interface IForumTopicResponse2 {
    groups: {
        id: number;
        name: string;
    };
    id: number;
    group: number;
    name: string;
    description: string;
    minimumUserClass: number;
    threads: {
        count: number;
        results: {
            id: number;
            title: string;
            topic: number;
            isLocked: boolean;
            isSticky: boolean;
            createdAt: string; // Date
            createdBy: number;
            numberOfPosts: number;
            latestPost?: {
                id: number;
                thread: number;
                topic: number;
                author: number;
                createdAt: string; // Date
                position: number;
            }
        }[];
    };
    numberOfThreads: number;
    numberOfPosts: number;
}

export interface IForumTopic {
    id: number;
    title: string;
    group?: number;
    sortOrder?: number;
    description?: string;
    numberOfThreads?: number;
    numberOfPosts?: number;
    latestPost?: number;
}

export default IForumTopic;