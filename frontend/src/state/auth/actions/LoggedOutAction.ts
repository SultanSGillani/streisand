import { put } from 'redux-saga/effects';

import { storeAuthToken } from '../../../utilities/storage';

export type ReceivedLogout = { type: 'RECEIVED_LOGOUT' };

type LoggedOutAction = ReceivedLogout;
export default LoggedOutAction;

export function* loggedOut() {
    storeAuthToken('');
    yield put<LoggedOutAction>({ type: 'RECEIVED_LOGOUT' });
}