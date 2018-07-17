
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { ITorrent } from '../../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps {
    file: File;
    finished?: (id: number) => void;
}

export type RequestTorrentUpload = { type: 'REQUEST_TORRENT_UPLOAD', props: IActionProps };
export type ReceivedTorrentUpload = { type: 'RECEIVED_TORRENT_UPLOAD', torrent: ITorrent };
export type FailedTorrentUpload = { type: 'FAILED_TORRENT_UPLOAD', props: IActionProps };

type UploadTorrentAction = RequestTorrentUpload | ReceivedTorrentUpload | FailedTorrentUpload;
export default UploadTorrentAction;
type Action = UploadTorrentAction;

function received(torrent: ITorrent, props: IActionProps): Action {
    if (props.finished) {
        props.finished(torrent.id);
    }
    return { type: 'RECEIVED_TORRENT_UPLOAD', torrent };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENT_UPLOAD', props };
}

export function uploadTorrent(file: File, finished?: (id: number) => void): Action {
    return { type: 'REQUEST_TORRENT_UPLOAD', props: { file, finished } };
}

const errorPrefix = (props: IActionProps) => `Uploading torrent file failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const uploadTorrentSaga = generateSage<RequestTorrentUpload>('REQUEST_TORRENT_UPLOAD', fetch);

function request(token: string, props: IActionProps): Promise<ITorrent> {
    const headers = { 'Content-Type': 'application/x-bittorrent' };
    return post({ token, data: props.file, headers, url: `${globals.apiUrl}/torrent-files/` });
}