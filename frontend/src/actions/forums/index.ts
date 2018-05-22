import { all } from 'redux-saga/effects';

import ForumGroupsAction, { forumGroupsSaga } from './ForumGroupsAction';
import ForumTopicAction, { allTopicSaga } from './topics';
import ForumThreadAction, { allThreadSaga } from './threads';
import ForumPostAction, { allPostSaga } from './posts';

type Action = ForumGroupsAction | ForumTopicAction | ForumThreadAction | ForumPostAction;
export default Action;

export function* allForumSaga() {
    yield all([
        forumGroupsSaga(),
        allTopicSaga(),
        allThreadSaga(),
        allPostSaga()
    ]);
}