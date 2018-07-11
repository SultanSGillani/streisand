
export interface ITrackerPeerResponse {
    id: string;
    user: {
        id: number;
        username: string;
        userClass: string;
        accountStatus: string;
        isDonor: boolean;
        customTitle: string;
        avatarUrl: string;
    };
    isActive: boolean;
    ipAddress: string;
    port: number;
    peerId: string;
    userAgent: string;
    compactRepresentation: string;
    bytesUploaded: number;
    bytesDownloaded: number;
    bytesRemaining: number;
    complete: boolean;
    firstAnnounce: string;
    lastAnnounce: string;
    torrent: number;
    announceKey: string;
}

export interface ITrackerPeer {
    id: string;
    user: number;
    isActive: boolean;
    ipAddress: string;
    port: number;
    peerId: string;
    userAgent: string;
    compactRepresentation: string;
    bytesUploaded: number;
    bytesDownloaded: number;
    bytesRemaining: number;
    complete: boolean;
    firstAnnounce: string;
    lastAnnounce: string;
    torrent: number;
    announceKey: string;
}

export default ITrackerPeer;