import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { invalidate } from './ReleasesAction';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

export interface IActionProps {
    id: number;
    film?: number;
    currentPage?: number;
}

export type RequestReleaseDeletion = { type: 'REQUEST_RELEASE_DELETION', props: IActionProps };
export type ReceivedReleaseDeletion = { type: 'RECEIVED_RELEASE_DELETION', props: IActionProps };
export type FailedReleaseDeletion = { type: 'FAILED_RELEASE_DELETION', props: IActionProps };

type DeleteReleaseAction = RequestReleaseDeletion | ReceivedReleaseDeletion | FailedReleaseDeletion;
export default DeleteReleaseAction;
type Action = DeleteReleaseAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_RELEASE_DELETION', props });
    if (props.currentPage) {
        yield put(invalidate({ page: props.currentPage }));
    } else if (props.film) {
        yield put(push(`/films/${props.film}`));
    } else {
        yield put(push('/'));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_RELEASE_DELETION', props };
}

export function deleteRelease(props: IActionProps): Action {
    return { type: 'REQUEST_RELEASE_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a release (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteReleaseSaga = generateSage<RequestReleaseDeletion>('REQUEST_RELEASE_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/releases/${props.id}/` });
}