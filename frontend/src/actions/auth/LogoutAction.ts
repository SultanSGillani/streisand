import { put } from 'redux-saga/effects';

import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { storeAuthToken } from '../../utilities/storage';
import { generateSage, generateAuthFetch } from '../sagas/generators';

export type RequestLogout = { type: 'REQUEST_LOGOUT' };
export type ReceivedLogout = { type: 'RECEIVED_LOGOUT' };
export type FailedLogout = { type: 'FAILED_LOGOUT' };

type LogoutAction = RequestLogout | ReceivedLogout | FailedLogout;
export default LogoutAction;
type Action = LogoutAction;

export function* received() {
    storeAuthToken('');
    yield put<Action>({ type: 'RECEIVED_LOGOUT' });
}

function failure(): Action {
    return { type: 'FAILED_LOGOUT' };
}

export function logout(): Action {
    return { type: 'REQUEST_LOGOUT' };
}

const errorPrefix = 'User logout failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const logoutSaga = generateSage<RequestLogout>('REQUEST_LOGOUT', fetch);

function request(token: string): Promise<void> {
    return post({ token, url: `${globals.apiUrl}/knox/logout/` });
}
