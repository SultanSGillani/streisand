
import ITorrent from '../../models/ITorrent';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.torrents;

export type RequestTorrents = { type: 'REQUEST_TORRENTS', props: IActionProps };
export type ReceivedTorrents = { type: 'RECEIVED_TORRENTS', props: { page: number, pageSize: number, count: number, items: ITorrent[] } };
export type FailedTorrents = { type: 'FAILED_TORRENTS', props: IActionProps };

type TorrentsAction = RequestTorrents | ReceivedTorrents | FailedTorrents;
export default TorrentsAction;
type Action = TorrentsAction;

function received(response: IPagedResponse<ITorrent>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_TORRENTS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENTS', props };
}

export function getTorrents(page: number = 1): Action {
    return { type: 'REQUEST_TORRENTS', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of torrents failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const torrentsSaga = generateSage<RequestTorrents>('REQUEST_TORRENTS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ITorrent>> {
    return get({ token, url: `${globals.apiUrl}/torrent-files/?page=${props.page}&size=${PAGE_SIZE}` });
}
