
export interface ICommentResponse {
    id: number;
    film: number;
    author: {
        accountStatus: string;
        avatarUrl: string;
        customTitle: string;
        id: number;
        isDonor: boolean;
        username: string;
        userClass: string;
    };
    body: string;
    createdAt: string;
    modifiedAt: string;
}

export interface IComment {
    id: number;
    film: number;
    author: number;
    body: string;
    createdAt: string;
    modifiedAt: string;
}

export interface ICommentCreation {
    film: number;
    body: string;
}

export interface ICommentUpdate {
    id: number;
    film: number;
    body: string;
}

export default IComment;
