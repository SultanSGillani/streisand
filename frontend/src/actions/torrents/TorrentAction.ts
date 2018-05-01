import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import ITorrent from '../../models/ITorrent';

type TorrentAction =
    { type: 'FETCHING_TORRENT', id: number } |
    { type: 'RECEIVED_TORRENT', torrent: ITorrent } |
    { type: 'TORRENT_FAILURE', id: number };
export default TorrentAction;
type Action = TorrentAction | ErrorAction;

function fetching(id: number): Action {
    return { type: 'FETCHING_TORRENT', id };
}

function received(id: number, response: ITorrent): Action {
    return {
        type: 'RECEIVED_TORRENT',
        torrent: response
    };
}

function failure(id: number): Action {
    return { type: 'TORRENT_FAILURE', id };
}

export function getTorrent(id: number): ThunkAction<Action> {
    const errorPrefix = `Fetching torrent (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: id });
}

function request(token: string, id: number): Promise<ITorrent> {
    return get({ token, url: `${globals.apiUrl}/torrents/${id}/` });
}