import { replace } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';

import Store from '../../store';
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { storeAuthToken } from '../../utilities/storage';
import { generateFetch, generateSage } from '../sagas/generators';

interface IActionProps {
    username: string;
    password: string;
}

export type RequestAuthentication = { type: 'REQUEST_AUTHENTICATION', props: IActionProps };
export type ReceivedAuthentication = { type: 'RECEIVED_AUTHENTICATION', token: string };
export type FailedAuthentication = { type: 'FAILED_AUTHENTICATION' };

type AuthenticateAction = RequestAuthentication | ReceivedAuthentication | FailedAuthentication;
export default AuthenticateAction;
type Action = AuthenticateAction;

type AuthResponse = { token: string; };

function* received(response: AuthResponse) {
    storeAuthToken(response.token);
    yield put<Action>({ type: 'RECEIVED_AUTHENTICATION', token: response.token });
    const state: Store.All = yield select();
    if (state.location.referrer) {
        yield put(replace(state.location.referrer));
    } else {
        yield put(replace('/'));
    }
}

function failure(): Action {
    return { type: 'FAILED_AUTHENTICATION' };
}

export function login(username: string, password: string): Action {
    return { type: 'REQUEST_AUTHENTICATION', props: { username, password } };
}

const errorPrefix = 'Authentication failed';
const fetch = generateFetch({ errorPrefix, request, received, failure });
export const authenticateSaga = generateSage<RequestAuthentication>('REQUEST_AUTHENTICATION', fetch);

function request(data: IActionProps): Promise<AuthResponse> {
    return post({ data, url: `${globals.apiUrl}/login/` });
}
