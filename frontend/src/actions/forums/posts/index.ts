import { all } from 'redux-saga/effects';

import CreatePostAction, { creatForumPostSaga } from './CreatePostAction';
import DeletePostAction, { deleteforumPostSaga } from './DeletePostAction';
import UpdatePostAction, { updateForumPostSaga } from './UpdatePostAction';

type Action = CreatePostAction | DeletePostAction | UpdatePostAction;
export default Action;

export function* allPostSaga() {
    yield all([
        creatForumPostSaga(),
        deleteforumPostSaga(),
        updateForumPostSaga()
    ]);
}