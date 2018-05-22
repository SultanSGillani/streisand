import { all } from 'redux-saga/effects';

import UserAction, { userSaga } from './UserAction';
import BulkUserAction, { bulkUserSaga } from './BulkUserAction';
import CurrentUserAction, { currentUserSage } from './CurrentUserAction';

type Action = UserAction | CurrentUserAction | BulkUserAction;
export default Action;

export function* allUserSaga() {
    yield all([
        userSaga(),
        bulkUserSaga(),
        currentUserSage()
    ]);
}