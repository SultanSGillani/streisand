import { all } from 'redux-saga/effects';
import { userSaga } from './actions/UserAction';
import { bulkUserSaga } from './actions/BulkUserAction';
import { currentUserSaga } from './actions/CurrentUserAction';
import { updateUserSaga } from './actions/UpdateUserAction';

export function* allUserSaga() {
    yield all([
        userSaga(),
        bulkUserSaga(),
        currentUserSaga(),
        updateUserSaga()
    ]);
}