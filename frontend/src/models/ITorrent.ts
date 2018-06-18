import IRelease from './IRelease';

export interface ITorrentResponse {
    directoryName: string;
    downloadUrl: string;
    file?: { // present if isSingleFile
        name: string;
        sizeInBytes: number;
    };
    files?: { // present if !isSingleFile
        pathComponents: string[];
        sizeInBytes: number;
    }[];
    id: number;
    infoHash: string;
    isAcceptingReseedRequests: boolean;
    isApproved: boolean;
    isSingleFile: boolean;
    lastSeeded: string;
    moderatedBy: number;
    pieceSizeInBytes: number;
    release: IRelease;
    reseedRequest: any; // TODO: What is this?
    snatchCount: number;
    totalSizeInBytes: number;
    uploadedAt: string; // Date
    uploadedBy: {
        accountStatus: string;
        avatarUrl: string;
        customTitle: string;
        id: number;
        isDonor: boolean;
        username: string;
        userClass: string;
    };
}

export interface ITorrentFile {
    path: string;
    size: number;
}

export interface ITorrent {
    files: ITorrentFile[];
    directoryName: string;
    downloadUrl: string;
    id: number;
    infoHash: string;
    isAcceptingReseedRequests: boolean;
    isApproved: boolean;
    lastSeeded: string;
    moderatedBy: number;
    pieceSizeInBytes: number;
    release: IRelease;
    reseedRequest: any; // TODO: What is this?
    snatchCount: number;
    totalSizeInBytes: number;
    uploadedAt: string; // Date
    uploadedBy: number;
}

export default ITorrent;
