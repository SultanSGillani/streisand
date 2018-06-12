
import ITorrent from '../../models/ITorrent';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { id: number; }

export type RequestTorrent = { type: 'REQUEST_TORRENT', props: IActionProps };
export type ReceivedTorrent = { type: 'RECEIVED_TORRENT', torrent: ITorrent };
export type FailedTorrent = { type: 'FAILED_TORRENT', props: IActionProps };

type TorrentAction = RequestTorrent | ReceivedTorrent | FailedTorrent;
export default TorrentAction;
type Action = TorrentAction;

function received(torrent: ITorrent): Action {
    return { type: 'RECEIVED_TORRENT', torrent };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENT', props };
}

export function getTorrent(id: number): Action {
    return { type: 'REQUEST_TORRENT', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching torrent (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const torrentSaga = generateSage<RequestTorrent>('REQUEST_TORRENT', fetch);

function request(token: string, props: IActionProps): Promise<ITorrent> {
    return get({ token, url: `${globals.apiUrl}/torrent-files/${props.id}/` });
}
