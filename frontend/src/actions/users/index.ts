import { all } from 'redux-saga/effects';

import UserAction, { userSaga } from './UserAction';
import BulkUserAction, { bulkUserSaga } from './BulkUserAction';
import UserUpdateAction, { updateUserSaga } from './UpdateUserAction';
import CurrentUserAction, { currentUserSage } from './CurrentUserAction';

type Action = UserAction | CurrentUserAction | BulkUserAction | UserUpdateAction;
export default Action;

export function* allUserSaga() {
    yield all([
        userSaga(),
        bulkUserSaga(),
        currentUserSage(),
        updateUserSaga()
    ]);
}