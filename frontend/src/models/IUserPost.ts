
export interface IUserPost {
    id: number;
    author: number;
    body?: string;
    createdAt: string;
    modifiedAt?: string;
    modifiedBy?: number;
}

export default IUserPost;