import { all } from 'redux-saga/effects';

import CommentsAction, { commentsSaga } from './CommentsAction';
import CreateCommentAction, { createCommentSaga } from './CreateCommentAction';

type Action = CommentsAction | CreateCommentAction;
export default Action;

export function* allCommentSaga() {
    yield all([
        commentsSaga(),
        createCommentSaga()
    ]);
}