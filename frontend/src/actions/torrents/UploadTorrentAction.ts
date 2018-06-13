
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import ITorrentFileInfo from '../../models/ITorrentFileInfo';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { file: File; }

export type RequestTorrent = { type: 'REQUEST_TORRENT_UPLOAD', props: IActionProps };
export type ReceivedTorrent = { type: 'RECEIVED_TORRENT_UPLOAD', item: ITorrentFileInfo };
export type FailedTorrent = { type: 'FAILED_TORRENT_UPLOAD', props: IActionProps };

type UploadTorrentAction = RequestTorrent | ReceivedTorrent | FailedTorrent;
export default UploadTorrentAction;
type Action = UploadTorrentAction;

function received(item: ITorrentFileInfo): Action {
    return { type: 'RECEIVED_TORRENT_UPLOAD', item };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENT_UPLOAD', props };
}

export function uploadTorrent(file: File): Action {
    return { type: 'REQUEST_TORRENT_UPLOAD', props: { file } };
}

const errorPrefix = (props: IActionProps) => `Uploading torrent file failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const uploadTorrentSaga = generateSage<RequestTorrent>('REQUEST_TORRENT_UPLOAD', fetch);

function request(token: string, props: IActionProps): Promise<ITorrentFileInfo> {
    const headers = { 'Content-Type': 'application/x-bittorrent' };
    return post({ token, data: props.file, headers, url: `${globals.apiUrl}/torrent-files/` });
}