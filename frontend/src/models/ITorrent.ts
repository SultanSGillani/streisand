
interface ITorrent {
    id: number;
    filmId: number;
    cut: 'Theatrical';
    codec: 'XviD';
    container: 'AVI';
    resolution: 'Standard Def';
    sourceMedia: 'DVD';
    isSource: boolean;
    is3d: boolean;
    size: string; // 1.4 GB TODO: can we get the size in bytes (number) so we can show render it how we want in the ui?
    uploadedBy: string; // user id
    uploadedAt: string; // utc datetime string '2009-01-19T17:29:31Z'
    lastSeeded: null;
    snatchCount: number;
    reseedRequest: null;
    isAcceptingReseedRequests: boolean; // TODO: what is this?
    isApproved: boolean;
    moderatedBy: string; // user id
    releaseName: string;
    releaseGroup: string;
    isScene: boolean;
    infoHash: string;
    fileList: any[]; // TODO: this is always empty
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
}

export default ITorrent;