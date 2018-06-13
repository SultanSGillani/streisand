interface ITorrent {
    id: number;
    filmId: number;
    infoHash?: string;
    downloadUrl: string;
    totalSizeInBytes: number;
    pieceSizeInBytes: number;
    uploadedBy: {
        id: number;
        username: string;
        userClass: string;
        accountStatus: string;
        isDonor: boolean;
        customTitle: string;
        avatarUrl: string;
    };
    release: {
        id: number;
        film: {
            id: number;
            title: string;
            year: number;
            imdbId: number;
            tmdbId: number;
            posterUrl: string;
            fanartUrl: string;
            lists: string;
            filmComments: string[];
            trailerUrl: string;
            trailerType: string;
            durationInMinutes: number;
            description: string;
            genreTags: string[];
        };
        mediainfo?: {
            id: number;
            text: string;
            runtime: string; // duration example: '01:16:00'
            resolutionWidth: number;
            resolutionHeight: number;
            displayAspectRatio: string;
            bitRate: string;
            frameRate: string;
            hasChapters: boolean;
            isDxvaCompliant: boolean;
            isQualityEncode: boolean;
        };
        cut: 'Theatrical';
        codec: 'XviD';
        container: 'AVI';
        resolution: 'Standard Def';
        sourceMedia: 'DVD';
        isSource: boolean;
        isScene: boolean;
        is_3d: boolean;
        releaseName: string;
        releaseGroup: string;
        nfo?: string;
        description: string;
    };
    uploadedAt: string;
    lastSeeded: string;
    snatchCount: number;
    reseedRequest: boolean;
    isAcceptingReseedRequests: boolean;
    isApproved: boolean;
    moderatedBy: string;
    isSingleFile: boolean;
    directoryName: string;
    file: {
        name: string;
        sizeInBytes: number;
    };
    files: any[]; // TODO: this is always empty
}

export default ITorrent;
