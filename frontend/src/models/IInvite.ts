
export interface IInviteResponse {
    email: string;
    key: string;
    createdAt: string;
    expiresAt: string;
    offeredBy: {
        accountStatus: string;
        avatarUrl: string;
        customTitle: string;
        id: number;
        isDonor: boolean;
        username: string;
        userClass: string;
    };
}

interface IInvite {
    id: string;
    email: string;
    key: string;
    createdAt: string;
    expiresAt: string;
    offeredBy: number;
}

export default IInvite;