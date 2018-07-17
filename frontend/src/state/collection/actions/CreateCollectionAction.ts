import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import ICollection, { ICollectionUpdate } from '../../../models/ICollection';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

interface IActionProps extends ICollectionUpdate { }

export type RequestNewCollection = { type: 'REQUEST_NEW_COLLECTION', props: IActionProps };
export type ReceivedNewCollection = { type: 'RECEIVED_NEW_COLLECTION', collection: ICollection };
export type FailedNewCollection = { type: 'FAILED_NEW_COLLECTION', props: IActionProps };

type CreateCollectionAction = RequestNewCollection | ReceivedNewCollection | FailedNewCollection;
export default CreateCollectionAction;
type Action = CreateCollectionAction;

function* received(collection: ICollection) {
    yield put<Action>({ type: 'RECEIVED_NEW_COLLECTION', collection });
    yield put(push(`/collection/${collection.id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_COLLECTION', props };
}

export function createCollection(props: ICollectionUpdate): Action {
    return { type: 'REQUEST_NEW_COLLECTION', props };
}

const errorPrefix = 'Creating a new collection failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createCollectionSaga = generateSage<RequestNewCollection>('REQUEST_NEW_COLLECTION', fetch);

function request(token: string, data: IActionProps): Promise<ICollection> {
    return post({ token, data, url: `${globals.apiUrl}/film-collections/` });
}
