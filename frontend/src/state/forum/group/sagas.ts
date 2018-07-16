import { all } from 'redux-saga/effects';

import { forumGroupsSaga } from './actions/ForumGroupsAction';

export function* allGroupSaga() {
    yield all([
        forumGroupsSaga()
    ]);
}