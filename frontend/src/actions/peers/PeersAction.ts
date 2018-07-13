
import IUser from '../../models/IUser';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import { ITrackerPeerResponse, ITrackerPeer } from '../../models/ITrackerPeer';
import { transformPeers } from './transforms';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.peers;

export type RequestPeers = { type: 'REQUEST_PEERS', props: IActionProps };
export type ReceivedPeers = {
    type: 'RECEIVED_PEERS',
    props: { page: number, pageSize: number, count: number, items: ITrackerPeer[] },
    users: IUser[]
};
export type FailedPeers = { type: 'FAILED_PEERS', props: IActionProps };

type PeersAction = RequestPeers | ReceivedPeers | FailedPeers;
export default PeersAction;
type Action = PeersAction;

function received(response: IPagedResponse<ITrackerPeerResponse>, props: IActionProps): Action {
    const info = transformPeers(response.results);
    return {
        type: 'RECEIVED_PEERS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: info.peers
        },
        users: info.users
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_PEERS', props };
}

export function getPeers(id: number, page: number = 1): Action {
    return { type: 'REQUEST_PEERS', props: { id, page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of tracker peers for torrent ${props.id} failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const peersSaga = generateSage<RequestPeers>('REQUEST_PEERS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ITrackerPeerResponse>> {
    return get({ token, url: `${globals.apiUrl}/tracker-peers/?page=${props.page}&size=${PAGE_SIZE}&torrent_id=${props.id}` });
}