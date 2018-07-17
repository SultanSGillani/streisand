
import ICollection from '../../../models/ICollection';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IPagedResponse from '../../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.collections;

export type RequestCollections = { type: 'REQUEST_COLLECTIONS', props: IActionProps };
export type ReceivedCollections = {
    type: 'RECEIVED_COLLECTIONS',
    props: { page: number, pageSize: number, count: number, items: ICollection[] }
};
export type FailedCollections = { type: 'FAILED_COLLECTIONS', props: IActionProps };
export type InvalidateCollections = { type: 'INVALIDATE_COLLECTIONS', props: IActionProps };

type CollectionsAction = RequestCollections | ReceivedCollections | FailedCollections | InvalidateCollections;
export default CollectionsAction;
type Action = CollectionsAction;

function received(response: IPagedResponse<ICollection>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_COLLECTIONS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COLLECTIONS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_COLLECTIONS', props };
}

export function getCollections(page: number = 1): Action {
    return { type: 'REQUEST_COLLECTIONS', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of collections failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const collectionsSaga = generateSage<RequestCollections>('REQUEST_COLLECTIONS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ICollection>> {
    return get({ token, url: `${globals.apiUrl}/film-collections/?page=${props.page}&size=${PAGE_SIZE}` });
}
