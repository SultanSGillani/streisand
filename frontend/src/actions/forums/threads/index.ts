import { all } from 'redux-saga/effects';

import ForumThreadAction, { forumThreadSaga } from './ForumThreadAction';
import ThreadSearchAction, { threadSearchSaga } from './ThreadSearchAction';
import CreateThreadAction, { creatForumThreadSaga } from './CreateThreadAction';
import DeleteThreadAction, { deleteforumThreadSaga } from './DeleteThreadAction';

type Action = ForumThreadAction | CreateThreadAction | DeleteThreadAction | ThreadSearchAction;
export default Action;

export function* allThreadSaga() {
    yield all([
        forumThreadSaga(),
        deleteforumThreadSaga(),
        creatForumThreadSaga(),
        threadSearchSaga()
    ]);
}