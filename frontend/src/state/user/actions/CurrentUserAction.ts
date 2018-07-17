
import { transformUser } from './transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IUser, { IUserResponse } from '../../../models/IUser';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

export type RequestCurrentUser = { type: 'REQUEST_CURRENT_USER' };
export type ReceivedCurrentUser = { type: 'RECEIVED_CURRENT_USER', user: IUser };
export type FailedCurrentUser = { type: 'FAILED_CURRENT_USER' };

type CurrentUserAction = RequestCurrentUser | ReceivedCurrentUser | FailedCurrentUser;
export default CurrentUserAction;
type Action = CurrentUserAction;

function received(response: IUserResponse): Action {
    return {
        type: 'RECEIVED_CURRENT_USER',
        user: transformUser(response)
    };
}

function failure(): Action {
    return { type: 'FAILED_CURRENT_USER' };
}

export function getCurrentUser(): Action {
    return { type: 'REQUEST_CURRENT_USER' };
}

const errorPrefix = 'Fetching current user information failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const currentUserSaga = generateSage<RequestCurrentUser>('REQUEST_CURRENT_USER', fetch);

function request(token: string): Promise<IUserResponse> {
    return get({ token, url: `${globals.apiUrl}/current-user/` });
}