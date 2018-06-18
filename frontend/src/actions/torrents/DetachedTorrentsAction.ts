
import IUser from '../../models/IUser';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import { transformTorrents } from './transforms';
import IPagedResponse from '../../models/base/IPagedResponse';
import ITorrent, { ITorrentResponse } from '../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.torrents;

export type RequestDetachedTorrents = { type: 'REQUEST_DETACHED_TORRENTS', props: IActionProps };
export type ReceivedDetachedTorrents = {
    type: 'RECEIVED_DETACHED_TORRENTS',
    props: { page: number, pageSize: number, count: number, items: ITorrent[] },
    users: IUser[]
};
export type FailedDetachedTorrents = { type: 'FAILED_DETACHED_TORRENTS', props: IActionProps };
export type InvalidateDetachedTorrents = { type: 'INVALIDATE_DETACHED_TORRENTS', props: IActionProps };

type DetachedTorrentsAction = RequestDetachedTorrents | ReceivedDetachedTorrents | FailedDetachedTorrents | InvalidateDetachedTorrents;
export default DetachedTorrentsAction;
type Action = DetachedTorrentsAction;

function received(response: IPagedResponse<ITorrentResponse>, props: IActionProps): Action {
    const info = transformTorrents(response.results);
    return {
        type: 'RECEIVED_DETACHED_TORRENTS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: info.torrents
        },
        users: info.users
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_DETACHED_TORRENTS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_DETACHED_TORRENTS', props };
}

export function getDetachedTorrents(page: number = 1): Action {
    return { type: 'REQUEST_DETACHED_TORRENTS', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the detached torrents failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const detachedTorrentsSaga = generateSage<RequestDetachedTorrents>('REQUEST_DETACHED_TORRENTS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ITorrentResponse>> {
    return get({ token, url: `${globals.apiUrl}/torrents-no-releases/?page=${props.page}&size=${PAGE_SIZE}` });
}
