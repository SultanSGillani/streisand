import { all } from 'redux-saga/effects';

import { forumTopicSaga } from './actions/ForumTopicAction';
import { creatForumTopicSaga } from './actions/CreateTopicAction';
import { deleteForumTopicSaga } from './actions/DeleteTopicAction';

export function* allTopicSaga() {
    yield all([
        forumTopicSaga(),
        creatForumTopicSaga(),
        deleteForumTopicSaga()
    ]);
}