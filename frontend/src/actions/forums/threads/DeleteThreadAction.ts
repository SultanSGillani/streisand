import { push } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';

import Store from '../../../store';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { invalidate } from '../topics/ForumTopicAction';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    topic: number;
    thread: number;
    currentPage: number;
}

export type RequestThreadDeletion = { type: 'REQUEST_FORUM_THREAD_DELETION', props: IActionProps } ;
export type ReceivedThreadDeletion = { type: 'RECEIVED_FORUM_THREAD_DELETION', props: IActionProps } ;
export type FailedThreadDeletion = { type: 'FAILED_FORUM_THREAD_DELETION', props: IActionProps };

type DeleteThreadAction = RequestThreadDeletion | ReceivedThreadDeletion | FailedThreadDeletion;
export default DeleteThreadAction;
type Action = DeleteThreadAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_FORUM_THREAD_DELETION', props });

    // Ideally this response would include an updated count of threads so
    // we don't have to assume the count hasn't changed.
    const byTopic = yield select((state: Store.All) => state.sealed.forums.threads.byTopic);
    const page = byTopic[props.topic];
    const count = (page.count || 1) - 1;
    const lastPage = Math.ceil(count / globals.pageSize.threads) || 1;
    if (lastPage < props.currentPage) {
        yield put(push(`/forum/topic/${props.topic}/${lastPage}`));
    }
    yield put(invalidate({ id: props.topic, page: props.currentPage }));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_THREAD_DELETION', props };
}

export function deleteForumThread(props: IActionProps): Action {
    return { type: 'REQUEST_FORUM_THREAD_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a forum thread (${props.thread}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteforumThreadSaga = generateSage<RequestThreadDeletion>('REQUEST_FORUM_THREAD_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/forum-thread-items/${props.thread}/` });
}