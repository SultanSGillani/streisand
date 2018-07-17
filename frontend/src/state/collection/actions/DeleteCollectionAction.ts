import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { invalidate } from './CollectionsAction';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    id: number;
    currentPage?: number;
}

export type RequestCollectionDeletion = { type: 'REQUEST_COLLECTION_DELETION', props: IActionProps };
export type ReceivedCollectionDeletion = { type: 'RECEIVED_COLLECTION_DELETION', props: IActionProps };
export type FailedCollectionDeletion = { type: 'FAILED_COLLECTION_DELETION', props: IActionProps };

type DeleteCollectionAction = RequestCollectionDeletion | ReceivedCollectionDeletion | FailedCollectionDeletion;
export default DeleteCollectionAction;
type Action = DeleteCollectionAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_COLLECTION_DELETION', props });
    if (props.currentPage) {
        yield put(invalidate({ page: props.currentPage }));
    } else {
        yield put(push('/collection/1'));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COLLECTION_DELETION', props };
}

export function deleteCollection(props: IActionProps): Action {
    return { type: 'REQUEST_COLLECTION_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a collection (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteCollectionSaga = generateSage<RequestCollectionDeletion>('REQUEST_COLLECTION_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/film-collections/${props.id}/` });
}
