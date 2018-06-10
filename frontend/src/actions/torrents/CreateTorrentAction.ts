import { put } from 'redux-saga/effects';
// import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import ITorrent, { ITorrentUpdate } from '../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps extends ITorrentUpdate { }

export type RequestNewTorrent = { type: 'REQUEST_NEW_TORRENT', props: IActionProps };
export type ReceivedNewTorrent = { type: 'RECEIVED_NEW_TORRENT', torrent: ITorrent };
export type FailedNewTorrent = { type: 'FAILED_NEW_TORRENT', props: IActionProps };

type CreateTorrentAction = RequestNewTorrent | ReceivedNewTorrent | FailedNewTorrent;
export default CreateTorrentAction;
type Action = CreateTorrentAction;

function* received(torrent: ITorrent) {
    yield put<Action>({ type: 'RECEIVED_NEW_TORRENT', torrent });
    // yield put(push(`/wiki/${id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_TORRENT', props };
}

export function createTorrent(props: ITorrentUpdate): Action {
    return { type: 'REQUEST_NEW_TORRENT', props };
}

const errorPrefix = 'Creating a new torrent failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createTorrentSaga = generateSage<RequestNewTorrent>('REQUEST_NEW_TORRENT', fetch);

function request(token: string, data: IActionProps): Promise<ITorrent> {
    return post({ token, data, url: `${globals.apiUrl}/torrents/` });
}