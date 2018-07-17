import { all } from 'redux-saga/effects';

import { commentsSaga } from './actions/CommentsAction';
import { createCommentSaga } from './actions/CreateCommentAction';
import { updateCommentSaga } from './actions/UpdateCommentAction';
import { deleteCommentSaga } from './actions/DeleteCommentAction';

export function* allCommentSaga() {
    yield all([
        commentsSaga(),
        createCommentSaga(),
        updateCommentSaga(),
        deleteCommentSaga()
    ]);
}