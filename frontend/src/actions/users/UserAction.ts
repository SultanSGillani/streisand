import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import { transformUser } from './transforms';
import IUser, { IUserResponse } from '../../models/IUser';

type UserAction =
    { type: 'FETCHING_USER', id: number } |
    { type: 'RECEIVED_USER', user: IUser } |
    { type: 'USER_FAILURE', id: number };
export default UserAction;
type Action = UserAction | ErrorAction;

function fetching(id: number): Action {
    return { type: 'FETCHING_USER', id };
}

function received(id: number, response: IUserResponse): Action {
    return {
        type: 'RECEIVED_USER',
        user: transformUser(response)
    };
}

function failure(id: number): Action {
    return { type: 'USER_FAILURE', id };
}

export function getUser(id: number): ThunkAction<Action> {
    const errorPrefix = `Fetching user (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: id });
}

function request(token: string, id: number): Promise<IUserResponse> {
    return get({ token, url: `${globals.apiUrl}/users/${id}/` });
}