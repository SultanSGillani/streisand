import { all } from 'redux-saga/effects';

import ForumTopicAction, { forumTopicSaga } from './ForumTopicAction';
import CreateTopicAction, { creatForumTopicSaga } from './CreateTopicAction';
import DeleteTopicAction, { deleteForumTopicSaga } from './DeleteTopicAction';

type Action = ForumTopicAction | CreateTopicAction | DeleteTopicAction;
export default Action;

export function* allTopicSaga() {
    yield all([
        forumTopicSaga(),
        creatForumTopicSaga(),
        deleteForumTopicSaga()
    ]);
}