import { all } from 'redux-saga/effects';

import LogoutAction from './LogoutAction';
import AuthAction, { authenticateSaga } from './AuthenticateAction';
import ChangePasswordAction, { changePasswordSaga } from './ChangePasswordAction';

type Action = AuthAction | ChangePasswordAction | LogoutAction;
export default Action;

export function* allAuthSaga() {
    yield all([
        authenticateSaga(),
        changePasswordSaga()
    ]);
}