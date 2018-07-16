import { all } from 'redux-saga/effects';

import CommentsAction, { commentsSaga } from './CommentsAction';
import CreateCommentAction, { createCommentSaga } from './CreateCommentAction';
import CommentUpdateAction, { updateCommentSaga } from './UpdateCommentAction';
import DeleteCommentAction, { deleteCommentSaga } from './DeleteCommentAction';

type Action = CommentsAction | CreateCommentAction | CommentUpdateAction | DeleteCommentAction;
export default Action;

export function* allCommentSaga() {
    yield all([
        commentsSaga(),
        createCommentSaga(),
        updateCommentSaga(),
        deleteCommentSaga()
    ]);
}