
import IUser from '../../../models/IUser';
import IRelease from '../../../models/IRelease';
import globals from '../../../utilities/globals';
import { transformTorrents } from './transforms';
import { get } from '../../../utilities/Requestor';
import IPagedResponse from '../../../models/base/IPagedResponse';
import ITorrent, { ITorrentResponse } from '../../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.filmTorrents;

export type RequestReleaseTorrents = { type: 'REQUEST_RELEASE_TORRENTS', props: IActionProps };
export type ReceivedReleaseTorrents = {
    type: 'RECEIVED_RELEASE_TORRENTS',
    props: { id: number, page: number, pageSize: number, count: number, items: ITorrent[] },
    releases: IRelease[],
    users: IUser[]
};
export type FailedReleaseTorrents = { type: 'FAILED_RELEASE_TORRENTS', props: IActionProps };
export type InvalidateReleaseTorrents = { type: 'INVALIDATE_RELEASE_TORRENTS', props: IActionProps };

type ReleaseTorrentsAction = RequestReleaseTorrents | ReceivedReleaseTorrents | FailedReleaseTorrents | InvalidateReleaseTorrents;
export default ReleaseTorrentsAction;
type Action = ReleaseTorrentsAction;

function received(response: IPagedResponse<ITorrentResponse>, props: IActionProps): Action {
    const info = transformTorrents(response.results);
    return {
        type: 'RECEIVED_RELEASE_TORRENTS',
        props: {
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: info.torrents
        },
        releases: info.releases,
        users: info.users
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_RELEASE_TORRENTS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_RELEASE_TORRENTS', props };
}

export function getTorrents(id: number, page: number = 1): Action {
    return { type: 'REQUEST_RELEASE_TORRENTS', props: { id, page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the torrents (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const releaseTorrentsSaga = generateSage<RequestReleaseTorrents>('REQUEST_RELEASE_TORRENTS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ITorrentResponse>> {
    return get({ token, url: `${globals.apiUrl}/torrent-files/?release_id=${props.id}&page=${props.page}&size=${PAGE_SIZE}` });
}
