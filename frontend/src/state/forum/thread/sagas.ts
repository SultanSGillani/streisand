import { all } from 'redux-saga/effects';

import { forumThreadSaga } from './actions/ForumThreadAction';
import { threadSearchSaga } from './actions/ThreadSearchAction';
import { creatForumThreadSaga } from './actions/CreateThreadAction';
import { deleteforumThreadSaga } from './actions/DeleteThreadAction';

export function* allThreadSaga() {
    yield all([
        forumThreadSaga(),
        threadSearchSaga(),
        creatForumThreadSaga(),
        deleteforumThreadSaga()
    ]);
}