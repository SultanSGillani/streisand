
import IUser from '../../models/IUser';
import { ITorrentResponse, ITorrent, ITorrentFile } from '../../models/ITorrent';

export interface ITorrentInfo {
    torrents: ITorrent[];
    users: IUser[];
}

export function transformTorrents(response: ITorrentResponse[]): ITorrentInfo {
    const torrents: ITorrent[] = [];
    const users: IUser[] = [];
    for (const raw of response) {
        const {
            file,
            files,
            isSingleFile,
            uploadedBy,
            ...torrent
        } = raw;
        const transformedFiles: ITorrentFile[] = [];
        if (file) {
            transformedFiles.push({
                path: file.name,
                size: file.sizeInBytes
            });
        } else if (files) {
            for (const f of files) {
                transformedFiles.push({
                    path: f.pathComponents.join('/'),
                    size: f.sizeInBytes
                });
            }
        }

        torrents.push({
            ...torrent,
            files: transformedFiles,
            uploadedBy: uploadedBy.id
        });
        users.push({
            ...uploadedBy
        });
    }
    return { torrents, users };
}