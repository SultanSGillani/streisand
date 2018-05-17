
export interface IForumPostResponse {
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