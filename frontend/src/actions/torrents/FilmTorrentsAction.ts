
import ITorrent from '../../models/ITorrent';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.filmTorrents;

export type RequestFilmTorrents = { type: 'REQUEST_FILM_TORRENTS', props: IActionProps };
export type ReceivedFilmTorrents = { type: 'RECEIVED_FILM_TORRENTS', props: { id: number, page: number, pageSize: number, count: number, items: ITorrent[] } };
export type FailedFilmTorrents = { type: 'FAILED_FILM_TORRENTS', props: IActionProps };

type FilmTorrentsAction = RequestFilmTorrents | ReceivedFilmTorrents | FailedFilmTorrents;
export default FilmTorrentsAction;
type Action = FilmTorrentsAction;

function received(response: IPagedResponse<ITorrent>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_FILM_TORRENTS',
        props: {
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM_TORRENTS', props };
}

export function getTorrents(id: number, page: number = 1): Action {
    return { type: 'REQUEST_FILM_TORRENTS', props: {id, page }};
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the torrents (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const fiomTorrentsSaga = generateSage<RequestFilmTorrents>('REQUEST_FILM_TORRENTS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ITorrent>> {
    return get({ token, url: `${globals.apiUrl}/torrent-files/?release_id=${props.id}&page=${props.page}&size=${PAGE_SIZE}` });
}
