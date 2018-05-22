import { put } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import { logout } from './LogoutAction';
import globals from '../../utilities/globals';
import { putRequest } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps {
    oldPassword: string;
    newPassword: string;
}

export type RequestPasswordUpdate = { type: 'REQUEST_PASSWORD_UPDATE', props: IActionProps };
export type ReceivedPasswordUpdate = { type: 'RECEIVED_PASSWORD_UPDATE' };
export type FailedPasswordUpdate = { type: 'FAILED_PASSWORD_UPDATE', props: IActionProps };

type ChangePasswordAction = RequestPasswordUpdate | ReceivedPasswordUpdate | FailedPasswordUpdate;
export default ChangePasswordAction;
type Action = ChangePasswordAction;

function* received() {
    yield put<Action>({ type: 'RECEIVED_PASSWORD_UPDATE' });
    yield put(logout());
    yield put(replace('/login'));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_PASSWORD_UPDATE', props };
}

export function changePassword(oldPassword: string, newPassword: string): Action {
    return { type: 'REQUEST_PASSWORD_UPDATE', props: { oldPassword, newPassword } };
}

const errorPrefix = 'Changing user password failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const changePasswordSaga = generateSage<RequestPasswordUpdate>('REQUEST_PASSWORD_UPDATE', fetch);

function request(token: string, data: IActionProps): Promise<void> {
    return putRequest({ token, data, url: `${globals.apiUrl}/change-password/` });
}
