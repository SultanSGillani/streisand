
export interface IForumPostResponse {
    id: number;
    thread: number;
    threadTitle: string;
    topicId: number;
    topicName: string;
    authorId: number;
    authorUsername: string;
    body: string;
    bodyHtml: string;
    createdAt: string; // Date
    modifiedAt: string; // Date
    modifiedById: number;
    modifiedByUsername: string;
}

export interface IForumPostResponse2 {
    author: number;
    id: number;
    body: string;
    createdAt: string; // Date
    modifiedAt: string; // Date
    modifiedBy: number;
    thread: number;
}

export interface IForumPost {
    id: number;
    author: number;
    thread: number;
    createdAt: string; // Date
    body?: string;
    modifiedAt?: string; // Date
    modifiedBy?: number;
}

export interface IForumPostUpdate {
    thread: number;
    body: string;
}

export default IForumPost;