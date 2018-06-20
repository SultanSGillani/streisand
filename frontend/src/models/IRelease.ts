import IFilm from './IFilm';

export interface IRelaseMediaInfo {
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
}

export interface IReleaseResponse {
    film: IFilm;
    codec: string;
    container: string;
    cut: string;
    description: string;
    id: number;
    is3d: boolean;
    isScene: boolean;
    isSource: boolean;
    mediainfo?: IRelaseMediaInfo;
    nfo: string;
    releaseGroup: string;
    releaseName: string;
    resolution: string;
    sourceMedia: string;
}

interface IRelease {
    film: number;
    codec: string;
    container: string;
    cut: string;
    description: string;
    id: number;
    is3d: boolean;
    isScene: boolean;
    isSource: boolean;
    mediainfo?: IRelaseMediaInfo;
    nfo: string;
    releaseGroup: string;
    releaseName: string;
    resolution: string;
    sourceMedia: string;
}

export interface IReleaseUpdate {
    filmId: number;
    codec: string;
    container: string;
    cut: string;
    description: string;
    is3d: boolean;
    isScene: boolean;
    isSource: boolean;
    nfo: string;
    releaseGroup: string;
    releaseName: string;
    resolution: string;
    sourceMedia: string;
}

export default IRelease;