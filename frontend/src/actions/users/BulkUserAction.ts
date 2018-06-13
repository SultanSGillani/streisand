import Store from '../../store';
import { transformUser } from './transforms';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IUser, { IUserResponse } from '../../models/IUser';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateSage, generateFilteredFetch } from '../sagas/generators';

interface IActionProps {
    ids: number[];
}

type TriggerBulkUsers = { type: 'TRIGGER_BULK_USERS', props: IActionProps };
export type RequestBulkUsers = { type: 'REQUEST_BULK_USERS', props: IActionProps };
export type ReceivedBulkUsers = { type: 'RECEIVED_BULK_USERS', users: IUser[] };
export type FailedBulkUsers = { type: 'FAILED_BULK_USERS', props: IActionProps };

type BulkUserAction = TriggerBulkUsers | RequestBulkUsers | ReceivedBulkUsers | FailedBulkUsers;
export default BulkUserAction;
type Action = BulkUserAction;

function received(response: IPagedResponse<IUserResponse>): Action {
    return {
        type: 'RECEIVED_BULK_USERS',
        users: response.results.map(transformUser)
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_BULK_USERS', props };
}

export function getUsers(ids: number[]): Action {
    return { type: 'TRIGGER_BULK_USERS', props: { ids } };
}

export function requesting(props: IActionProps): Action {
    return { type: 'REQUEST_BULK_USERS', props };
}

function uniqueTruthy<T>(value: T, index: number, array: T[]): boolean {
    return value && array.indexOf(value) === index;
}

function filter(state: Store.All, props: IActionProps): IActionProps | undefined {
    const ids = props.ids.filter(uniqueTruthy).filter((id: number) => {
        const node = state.sealed.user.byId[id];
        const loaded = node && node.item && node.item.details;
        const loading = node && node.status.loading;
        return !loading && !loaded;
    });
    return ids.length ? { ids } : undefined;
}

const errorPrefix = 'Fetching current user information failed';
const fetch = generateFilteredFetch({ errorPrefix, request, received, failure, filter, requesting });
export const bulkUserSaga = generateSage<TriggerBulkUsers>('TRIGGER_BULK_USERS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IUserResponse>> {
    return get({ token, url: `${globals.apiUrl}/user-profiles/?id__in=${props.ids}` });
}