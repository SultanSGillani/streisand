import { push } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';

import Store from '../../../store';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { invalidate } from '../threads/ForumThreadAction';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    thread: number;
    post: number;
    currentPage: number;
}

export type RequestPostDeletion = { type: 'REQUEST_FORUM_POST_DELETION', props: IActionProps };
export type ReceivedPostDeletion = { type: 'RECEIVED_FORUM_POST_DELETION', props: IActionProps };
export type FailedPostDeletion = { type: 'FAILED_FORUM_POST_DELETION', props: IActionProps };

type DeletePostAction = RequestPostDeletion | ReceivedPostDeletion | FailedPostDeletion;
export default DeletePostAction;
type Action = DeletePostAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_FORUM_POST_DELETION', props });

    // Ideally this response would include an updated count of posts so
    // we don't have to assume the count hasn't changed.
    const byThread = yield select((state: Store.All) => state.sealed.forums.posts.byThread);
    const page = byThread[props.thread];
    const count = (page.count || 1) - 1;
    const lastPage = Math.ceil(count / globals.pageSize.posts) || 1;
    if (lastPage < props.currentPage) {
        yield put(push(`/forum/thread/${props.thread}/${lastPage}`));
    }
    yield put(invalidate({ id: props.thread, page: props.currentPage }));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_POST_DELETION', props };
}

export function deleteForumPost(props: IActionProps): Action {
    return { type: 'REQUEST_FORUM_POST_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a forum post (${props.post}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteforumPostSaga = generateSage<RequestPostDeletion>('REQUEST_FORUM_POST_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/forum-post-items/${props.post}/` });
}