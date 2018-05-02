import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import ITorrent from '../../models/ITorrent';
import IPagedResponse from '../../models/base/IPagedResponse';

type FilmTorrentsAction =
    { type: 'FETCHING_FILM_TORRENTS', id: number, page: number } |
    { type: 'RECEIVED_FILM_TORRENTS', id: number, page: number, count: number, torrents: ITorrent[] } |
    { type: 'TORRENTS_FILM_FAILURE', id: number, page: number };
export default FilmTorrentsAction;
type Action = FilmTorrentsAction | ErrorAction;

type Props = {
    id: number;
    page: number;
};

function fetching(props: Props): Action {
    return { type: 'FETCHING_FILM_TORRENTS', id: props.id, page: props.page };
}

function received(props: Props, response: IPagedResponse<ITorrent>): Action {
    return {
        page: props.page,
        id: props.id,
        count: response.count,
        type: 'RECEIVED_FILM_TORRENTS',
        torrents: response.results
    };
}

function failure(props: Props): Action {
    return { type: 'TORRENTS_FILM_FAILURE', id: props.id, page: props.page };
}

export function getTorrents(id: number, page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of the torrents (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: { id, page } });
}

function request(token: string, props: Props): Promise<IPagedResponse<ITorrent>> {
    return get({ token, url: `${globals.apiUrl}/torrents/?film_id=${props.id}&page=${props.page}` });
}