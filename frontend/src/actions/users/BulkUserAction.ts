import Store from '../../store';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import ErrorAction, { handleError } from '../ErrorAction';
import { transformUser } from './transforms';
import { ThunkAction, IDispatch } from '../ActionTypes';
import IUser, { IUserResponse } from '../../models/IUser';
import IPagedResponse from '../../models/base/IPagedResponse';
import { IUnkownError } from '../../models/base/IError';

type BulkUserAction =
    { type: 'FETCHING_BULK_USERS', ids: number[] } |
    { type: 'RECEIVED_BULK_USERS', users: IUser[] } |
    { type: 'FAILED_BULK_USERS', ids: number[] };
export default BulkUserAction;
type Action = BulkUserAction | ErrorAction;

function fetching(ids: number[]): Action {
    return { type: 'FETCHING_BULK_USERS', ids };
}

function received(ids: number[], response: IPagedResponse<IUserResponse>): Action {
    return {
        type: 'RECEIVED_BULK_USERS',
        users: response.results.map(transformUser)
    };
}

function failure(ids: number[]): Action {
    return { type: 'FAILED_BULK_USERS', ids };
}

function uniqueTruthy<T>(value: T, index: number, array: T[]): boolean {
    return value && array.indexOf(value) === index;
}

export function getUsers(ids: number[], ignoreCache?: boolean): ThunkAction<Action> {
    const errorPrefix = `Fetching users (${ids}) failed`;
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        if (!ignoreCache) {
            ids = ids.filter(uniqueTruthy).filter((id: number) => {
                const node = state.sealed.users.byId[id];
                const loaded = node && node.item && node.item.details;
                const loading = node && node.status.loading;
                return !loading && !loaded;
            });
        }
        if (!ids.length) {
            return;
        }
        dispatch(fetching(ids));
        return request(state.sealed.auth.token, ids).then((response: IPagedResponse<IUserResponse>) => {
            return dispatch(received(ids, response));
        }, (error: IUnkownError) => {
            dispatch(handleError(error, errorPrefix));
            return dispatch(failure(ids));
        });
    };
}

function request(token: string, ids: number[]): Promise<IPagedResponse<IUserResponse>> {
    return get({ token, url: `${globals.apiUrl}/user-profiles/?id__in=${ids}` });
}