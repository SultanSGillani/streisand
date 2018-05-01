import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import ITorrent from '../../models/ITorrent';
import IPagedResponse from '../../models/base/IPagedResponse';

type TorrentsAction =
    { type: 'FETCHING_TORRENTS', page: number } |
    { type: 'RECEIVED_TORRENTS', page: number, count: number, torrents: ITorrent[] } |
    { type: 'TORRENTS_FAILURE', page: number };
export default TorrentsAction;
type Action = TorrentsAction | ErrorAction;

function fetching(page: number): Action {
    return { type: 'FETCHING_TORRENTS', page };
}

function received(page: number, response: IPagedResponse<ITorrent>): Action {
    return {
        page: page,
        count: response.count,
        type: 'RECEIVED_TORRENTS',
        torrents: response.results
    };
}

function failure(page: number): Action {
    return { type: 'TORRENTS_FAILURE', page };
}

export function getTorrents(page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of torrents failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: page });
}

function request(token: string, page: number): Promise<IPagedResponse<ITorrent>> {
    return get({ token, url: `${globals.apiUrl}/torrents/?page=${page}` });
}