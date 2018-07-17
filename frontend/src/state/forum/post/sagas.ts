import { all } from 'redux-saga/effects';

import { creatForumPostSaga } from './actions/CreatePostAction';
import { deleteforumPostSaga } from './actions/DeletePostAction';
import { updateForumPostSaga } from './actions/UpdatePostAction';

export function* allPostSaga() {
    yield all([
        creatForumPostSaga(),
        deleteforumPostSaga(),
        updateForumPostSaga()
    ]);
}