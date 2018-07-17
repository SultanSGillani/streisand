import { replace } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';

import Store from '../../store';
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { storeAuthToken } from '../../../utilities/storage';
import { generateFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    key: string;
    email: string;
    username: string;
    password: string;
}

export type RequestRegistration = { type: 'REQUEST_REGISTRATION', props: IActionProps };
export type ReceivedRegistration = { type: 'RECEIVED_REGISTRATION', token: string };
export type FailedRegistration = { type: 'FAILED_REGISTRATION' };

type RegisterAction = RequestRegistration | ReceivedRegistration | FailedRegistration;
export default RegisterAction;
type Action = RegisterAction;

type AuthResponse = { token: string; };

function* received(response: AuthResponse) {
    storeAuthToken(response.token);
    yield put<Action>({ type: 'RECEIVED_REGISTRATION', token: response.token });
    const state: Store.All = yield select();
    if (state.location.referrer) {
        yield put(replace(state.location.referrer));
    } else {
        yield put(replace('/'));
    }
}

function failure(): Action {
    return { type: 'FAILED_REGISTRATION' };
}

export function register(props: IActionProps): Action {
    return { type: 'REQUEST_REGISTRATION', props };
}

const errorPrefix = 'Registration failed';
const fetch = generateFetch({ errorPrefix, request, received, failure });
export const registerSaga = generateSage<RequestRegistration>('REQUEST_REGISTRATION', fetch);

function request(props: IActionProps): Promise<AuthResponse> {
    const { key, ...rest } = props;
    const data = { invite_key: key, ...rest };
    return post({ data, url: `${globals.apiUrl}/register-user/` });
}
