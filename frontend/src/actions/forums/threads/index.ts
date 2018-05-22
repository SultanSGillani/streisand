import { all } from 'redux-saga/effects';

import ForumThreadAction, { forumThreadSaga } from './ForumThreadAction';
import CreateThreadAction, { creatForumThreadSaga } from './CreateThreadAction';
import DeleteThreadAction, { deleteforumThreadSaga } from './DeleteThreadAction';

type Action = ForumThreadAction | CreateThreadAction | DeleteThreadAction;
export default Action;

export function* allThreadSaga() {
    yield all([
        forumThreadSaga(),
        deleteforumThreadSaga(),
        creatForumThreadSaga()
    ]);
}