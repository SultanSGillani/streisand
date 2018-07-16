import { put } from 'redux-saga/effects';
// import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import { ICommentCreation, IComment, ICommentResponse } from '../../models/IComment';
import { transformComment } from './transforms';
import { invalidate } from './CommentsAction';

interface IActionProps extends ICommentCreation { }

export type RequestNewComment = { type: 'REQUEST_NEW_COMMENT', props: IActionProps };
export type ReceivedNewComment = { type: 'RECEIVED_NEW_COMMENT', comment: IComment };
export type FailedNewComment = { type: 'FAILED_NEW_COMMENT', props: IActionProps };

type CreateCommentAction = RequestNewComment | ReceivedNewComment | FailedNewComment;
export default CreateCommentAction;
type Action = CreateCommentAction;

function* received(response: ICommentResponse, props: IActionProps) {
    const info = transformComment(response);
    yield put<Action>({ type: 'RECEIVED_NEW_COMMENT', comment: info.comment });

    // Invalidate the first page of comments
    yield put(invalidate({ id: props.film, page: 1 }));
    // TODO: Navigate to the first page of comments
    // yield put(push(`/film/${props.film}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_COMMENT', props };
}

export function createComment(props: ICommentCreation): Action {
    return { type: 'REQUEST_NEW_COMMENT', props };
}

const errorPrefix = (props: IActionProps) => `Creating a new comment for film (${props.film}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createCommentSaga = generateSage<RequestNewComment>('REQUEST_NEW_COMMENT', fetch);

function request(token: string, data: IActionProps): Promise<ICommentResponse> {
    return post({ token, data, url: `${globals.apiUrl}/film-comments/` });
}