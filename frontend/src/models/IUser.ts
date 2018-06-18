
export interface IUserResponse {
    id: number;
    username: string;
    email: string;
    userClass: string;
    accountStatus: string;
    isDonor: boolean;
    customTitle: string;
    avatarUrl: string;
    profileDescription: string;
    averageSeedingSize: string;
    ircKey: string;
    inviteCount: number;
    bytesUploaded: number;
    bytesDownloaded: number;
    lastSeeded: string; // Date
    announceKey: number;
}

interface IUser {
    id: number;
    username: string;
    userClass: string;
    accountStatus: string;
    isDonor: boolean;
    customTitle: string;
    avatarUrl: string;

    details?: {
        email: string;
        profileDescription: string;
        averageSeedingSize: string;
        ircKey: string;
        inviteCount: number;
        bytesUploaded: number;
        bytesDownloaded: number;
        lastSeeded: string; // Date
        announceKey: number;
    };
}

export interface IUserUpdate {
    email?: string;
    avatarUrl?: string;
    profileDescription?: string;
}

export default IUser;