import { all } from 'redux-saga/effects';

import { allPostSaga } from './post/sagas';
import { allGroupSaga } from './group/sagas';
import { allTopicSaga } from './topic/sagas';
import { allThreadSaga } from './thread/sagas';

export function* allForumSaga() {
    yield all([
        allGroupSaga(),
        allTopicSaga(),
        allThreadSaga(),
        allPostSaga()
    ]);
}