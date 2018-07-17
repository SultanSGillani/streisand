
import IUser from '../../../models/IUser';
import IRelease from '../../../models/IRelease';
import { transformRelease } from '../../release/actions/transforms';
import { ITorrentResponse, ITorrent, ITorrentFile } from '../../../models/ITorrent';

export interface ITorrentInfo {
    torrents: ITorrent[];
    releases: IRelease[];
    users: IUser[];
}

export function transformTorrents(response: ITorrentResponse[]): ITorrentInfo {
    const torrents: ITorrent[] = [];
    const users: IUser[] = [];
    const releases: IRelease[] = [];
    for (const raw of response) {
        const {
            file,
            files,
            isSingleFile,
            uploadedBy,
            release,
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

        if (release) {
            releases.push(transformRelease(release).release);
        }

        torrents.push({
            ...torrent,
            files: transformedFiles,
            uploadedBy: uploadedBy.id,
            release: release ? release.id : undefined
        });
        users.push({
            ...uploadedBy
        });
    }
    return { torrents, users, releases };
}