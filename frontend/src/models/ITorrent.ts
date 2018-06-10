interface ITorrent {
    id: number;
    filmId: number;
    cut: string; // 'Theatrical';
    codec: string; // 'XviD';
    container: string; // 'AVI';
    resolution: string; // 'Standard Def';
    sourceMedia: string; // 'DVD';
    isSource: boolean;
    is3d: boolean;
    size: string; // 1.4 GB TODO: can we get the size in bytes (number) so we can show render it how we want in the ui?
    uploadedBy: number;
    uploadedAt: string; // utc datetime string '2009-01-19T17:29:31Z'
    lastSeeded: string;
    snatchCount: number;
    reseedRequest: boolean;
    isAcceptingReseedRequests: boolean; // TODO: what is this?
    isApproved: boolean;
    moderatedBy: number; // user id
    releaseName: string;
    releaseGroup: string;
    isScene: boolean;
    infoHash: string;
    downloadUrl: string;
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
        cut: string;
        codec: string;
        container: string;
        resolution: string;
        sourceMedia: string;
        isSource: boolean;
        isScene: boolean;
        is_3d: boolean;
        releaseName: string;
        releaseGroup: string;
        nfo: string;
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

        description: string;
    };
    totalSizeInBytes: number;
    pieceSizeInBytes: number;
    isSingleFile: boolean;
    directoryName: string;
    file: {
        name: string;
        sizeInBytes: number;
    };
    files: any[]; // TODO: this is always empty
    description: string;
    comments: number[];
}

export interface ITorrentUpdate {
    infoHash: string;
    downloadUrl: string;
    filmId: number;
    cut: string; // 'Theatrical';
    codec: string; // 'XviD';
    container: string; // 'AVI';
    resolution: string; // 'Standard Def';
    sourceMedia: string; // 'DVD';
    isSource: boolean;
    is3d: boolean;
    format: string;
    uploadedBy: number;
    releaseName: string;
    releaseGroup: string;
    isScene: boolean;
    nfo: string;
    mediainfo?: {
        text: string;
        displayAspectRatio: string;
        bitRate: string;
    };
    description: string;
    comments: number[];
}

export default ITorrent;
