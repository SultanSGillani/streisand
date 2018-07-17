import { push } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';

import Store from '../../../store';
import globals from '../../../../utilities/globals';
import { post } from '../../../../utilities/Requestor';
import { invalidate } from '../../thread/actions/ForumThreadAction';
import { IForumPostUpdate } from '../../../../models/forums/IForumPost';
import { generateAuthFetch, generateSage } from '../../../sagas/generators';

interface IActionProps extends IForumPostUpdate { }

export type RequestNewPost = { type: 'REQUEST_NEW_FORUM_POST', props: IActionProps };
export type ReceivedNewPost = { type: 'RECEIVED_NEW_FORUM_POST', id: number };
export type FailedNewPost = { type: 'FAILED_NEW_FORUM_POST', props: IActionProps };

type CreatePostAction = RequestNewPost | ReceivedNewPost | FailedNewPost;
export default CreatePostAction;
type Action = CreatePostAction;

function* received(response: any, props: IActionProps) {
    const id = response.id;
    yield put<Action>({ type: 'RECEIVED_NEW_FORUM_POST', id });

    // Ideally this response would include the position of the new post so
    // we don't have to guess which page it is going to be on.
    const byThread = yield select((state: Store.All) => state.sealed.forum.post.byThread);
    const page = byThread[props.thread];
    const count = (page.count || 0) + 1;
    const lastPage = Math.ceil(count / globals.pageSize.posts) || 1;

    // Invalidate last page of posts
    yield put(invalidate({ id: props.thread, page: lastPage }));
    // Navigate to last page
    yield put(push(`/forum/thread/${props.thread}/${lastPage}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_FORUM_POST', props };
}

export function postReply(props: IForumPostUpdate): Action {
    return { type: 'REQUEST_NEW_FORUM_POST', props };
}

const errorPrefix = 'Creating a new forum post failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const creatForumPostSaga = generateSage<RequestNewPost>('REQUEST_NEW_FORUM_POST', fetch);

function request(token: string, data: IActionProps): Promise<any> {
    return post({ token, data, url: `${globals.apiUrl}/forum-post-items/` });
}