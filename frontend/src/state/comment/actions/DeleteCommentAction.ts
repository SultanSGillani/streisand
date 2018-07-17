import { put } from 'redux-saga/effects';

import { invalidate } from './CommentsAction';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

export interface IActionProps {
    id: number;
    film: number;
    currentPage?: number;
}

export type RequestCommentDeletion = { type: 'REQUEST_COMMENT_DELETION', props: IActionProps };
export type ReceivedCommentDeletion = { type: 'RECEIVED_COMMENT_DELETION', props: IActionProps };
export type FailedCommentDeletion = { type: 'FAILED_COMMENT_DELETION', props: IActionProps };

type DeleteCommentAction = RequestCommentDeletion | ReceivedCommentDeletion | FailedCommentDeletion;
export default DeleteCommentAction;
type Action = DeleteCommentAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_COMMENT_DELETION', props });
    if (props.currentPage) {
        yield put(invalidate({ page: props.currentPage, id: props.film }));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COMMENT_DELETION', props };
}

export function deleteComment(props: IActionProps): Action {
    return { type: 'REQUEST_COMMENT_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a comment (${props.id}) for film (${props.film}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteCommentSaga = generateSage<RequestCommentDeletion>('REQUEST_COMMENT_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/film-comments/${props.id}/` });
}