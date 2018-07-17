
import ICollection from '../../../models/ICollection';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps { id: number; }

export type RequestCollection = { type: 'REQUEST_COLLECTION', props: IActionProps };
export type ReceivedCollection = { type: 'RECEIVED_COLLECTION', collection: ICollection };
export type FailedCollection = { type: 'FAILED_COLLECTION', props: IActionProps };

type CollectionAction = RequestCollection | ReceivedCollection | FailedCollection;
export default CollectionAction;
type Action = CollectionAction;

export function received(collection: ICollection): Action {
    return { type: 'RECEIVED_COLLECTION', collection };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COLLECTION', props };
}

export function getCollection(id: number): Action {
    return { type: 'REQUEST_COLLECTION', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching collection (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const collectionSaga = generateSage<RequestCollection>('REQUEST_COLLECTION', fetch);

function request(token: string, props: IActionProps): Promise<ICollection> {
    return get({ token, url: `${globals.apiUrl}/film-collections/${props.id}/` });
}
