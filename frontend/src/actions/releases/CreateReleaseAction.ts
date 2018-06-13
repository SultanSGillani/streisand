import { put } from 'redux-saga/effects';
// import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import ITorrent, { IReleaseUpdate } from '../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps extends IReleaseUpdate { }

export type RequestNewRelease = { type: 'REQUEST_NEW_RELEASE', props: IActionProps };
export type ReceivedNewRelease = { type: 'RECEIVED_NEW_RELEASE', torrent: ITorrent };
export type FailedNewRelease = { type: 'FAILED_NEW_RELEASE', props: IActionProps };

type CreateReleaseAction = RequestNewRelease | ReceivedNewRelease | FailedNewRelease;
export default CreateReleaseAction;
type Action = CreateReleaseAction;

function* received(torrent: ITorrent) {
    yield put<Action>({ type: 'RECEIVED_NEW_RELEASE', torrent });
    // yield put(push(`/wiki/${id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_RELEASE', props };
}

export function createRelease(props: IReleaseUpdate): Action {
    return { type: 'REQUEST_NEW_RELEASE', props };
}

const errorPrefix = 'Creating a new torrent failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createReleaseSaga = generateSage<RequestNewRelease>('REQUEST_NEW_RELEASE', fetch);

function request(token: string, data: IActionProps): Promise<ITorrent> {
    return post({ token, data, url: `${globals.apiUrl}/releases/` });
}