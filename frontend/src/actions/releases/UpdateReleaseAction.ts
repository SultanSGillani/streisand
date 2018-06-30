import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { transformRelease } from './transforms';
import { patch } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import IRelease, { IReleaseUpdate, IReleaseResponse } from '../../models/IRelease';

interface IActionProps extends IReleaseUpdate { id: number; }

export type RequestReleaseUpdate = { type: 'REQUEST_RELEASE_UPDATE', props: IActionProps };
export type ReceivedtReleaseUpdate = { type: 'RECEIVED_RELEASE_UPDATE', release: IRelease };
export type FailedReleaseUpdate = { type: 'FAILED_RELEASE_UPDATE', props: IActionProps };

type UpdateReleaseAction = RequestReleaseUpdate | ReceivedtReleaseUpdate | FailedReleaseUpdate;
export default UpdateReleaseAction;
type Action = UpdateReleaseAction;

function* received(response: IReleaseResponse, props: IActionProps) {
    const info = transformRelease(response);
    yield put<Action>({ type: 'RECEIVED_RELEASE_UPDATE', release: info.release });
    yield put(push(`/release/${props.id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_RELEASE_UPDATE', props };
}

export function updateRelease(id: number, release: IReleaseUpdate): Action {
    return { type: 'REQUEST_RELEASE_UPDATE', props: { id, ...release } };
}

const errorPrefix = (props: IActionProps) => `Updating a release (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateReleaseSaga = generateSage<RequestReleaseUpdate>('REQUEST_RELEASE_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<IReleaseResponse> {
    const { id, ...data } = props;
    return patch({ token, data, url: `${globals.apiUrl}/releases/${id}/` });
}