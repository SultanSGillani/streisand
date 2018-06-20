import { all } from 'redux-saga/effects';

import LogoutAction, { logoutSaga } from './LogoutAction';
import RegisterAction, { registerSaga } from './RegisterAction';
import AuthAction, { authenticateSaga } from './AuthenticateAction';
import ChangePasswordAction, { changePasswordSaga } from './ChangePasswordAction';

type Action = AuthAction | ChangePasswordAction | LogoutAction | RegisterAction;
export default Action;

export function* allAuthSaga() {
    yield all([
        authenticateSaga(),
        changePasswordSaga(),
        logoutSaga(),
        registerSaga()
    ]);
}