
import globals from '../../../utilities/globals';
import { putRequest } from '../../../utilities/Requestor';
import ICollection, { ICollectionUpdate } from '../../../models/ICollection';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps extends ICollectionUpdate { id: number; }

export type RequestCollectionUpdate = { type: 'REQUEST_COLLECTION_UPDATE', props: IActionProps };
export type ReceivedCollectionUpdate = { type: 'RECEIVED_COLLECTION_UPDATE', collection: ICollection };
export type FailedCollectionUpdate = { type: 'FAILED_COLLECTION_UPDATE', props: IActionProps };

type CollectionUpdateAction = RequestCollectionUpdate | ReceivedCollectionUpdate | FailedCollectionUpdate;
export default CollectionUpdateAction;
type Action = CollectionUpdateAction;

function received(collection: ICollection): Action {
    return { type: 'RECEIVED_COLLECTION_UPDATE', collection };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COLLECTION_UPDATE', props };
}

export function updateCollection(id: number, collection: ICollectionUpdate): Action {
    return { type: 'REQUEST_COLLECTION_UPDATE', props: { id, ...collection } };
}

const errorPrefix = (props: IActionProps) => `Updating a collection (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateCollectionSaga = generateSage<RequestCollectionUpdate>('REQUEST_COLLECTION_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<ICollection> {
    const { id, ...data } = props;
    return putRequest({ token, data, url: `${globals.apiUrl}/film-collections/${id}/` });
}
