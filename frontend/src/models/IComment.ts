
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
    text: string;
    createdAt: string;
    modifiedAt: string;
}

export interface IComment {
    id: number;
    film: number;
    author: number;
    text: string;
    createdAt: string;
    modifiedAt: string;
}

export interface ICommentCreation {
    film: number;
    text: string;
}

export default IComment;