import { all } from 'redux-saga/effects';

import { logoutSaga } from './actions/LogoutAction';
import { registerSaga } from './actions/RegisterAction';
import { authenticateSaga } from './actions/AuthenticateAction';
import { changePasswordSaga } from './actions/ChangePasswordAction';

export function* allAuthSaga() {
    yield all([
        authenticateSaga(),
        changePasswordSaga(),
        logoutSaga(),
        registerSaga()
    ]);
}