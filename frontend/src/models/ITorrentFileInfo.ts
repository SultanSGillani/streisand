
interface ITorrentFileInfo {
    createdBy?: string;
    directoryName?: string;
    downloadUrl: string;
    file: {
        name: string;
        sizeInBytes: number;
    };
    infoHash: string;
    isSingleFile: boolean;
    pieceSizeInBytes: number;
}

export default ITorrentFileInfo;