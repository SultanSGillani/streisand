
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
}

interface IUser {
    id: number;
    username: string;

    details?: {
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
    };
}

export default IUser;