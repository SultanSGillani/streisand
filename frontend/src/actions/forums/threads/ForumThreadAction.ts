import { put } from 'redux-saga/effects';

import { transformThread } from '../transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import { getUsers } from '../../users/BulkUserAction';
import { IForumGroupData } from '../../../models/forums/IForumGroup';
import { generateAuthFetch, generateSage } from '../../sagas/generators';
import { IForumThreadResponse } from '../../../models/forums/IForumThread';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.posts;

export type RequestThread = { type: 'REQUEST_FORUM_THREAD', props: IActionProps };
export type ReceivedThread = {
    type: 'RECEIVED_FORUM_THREAD',
    props: { id: number, page: number, count: number, pageSize: number, data: IForumGroupData }
};
export type FailedThread = { type: 'FAILED_FORUM_THREAD', props: IActionProps };
export type InvalidateThread = { type: 'INVALIDATE_FORUM_THREAD', props: IActionProps };

type ForumThreadAction = RequestThread | ReceivedThread | FailedThread | InvalidateThread;
export default ForumThreadAction;
type Action = ForumThreadAction;

function* received(response: IForumThreadResponse, props: IActionProps) {
    const data = transformThread(response);
    yield put<Action>({
        type: 'RECEIVED_FORUM_THREAD',
        props: {
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.posts.count,
            data: data
        }
    });
    if (data.users.length) {
        yield put(getUsers(data.users));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_THREAD', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_FORUM_THREAD', props };
}

export function getPosts(id: number, page: number = 1): Action {
    return { type: 'REQUEST_FORUM_THREAD', props: { id, page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the forum thread (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const forumThreadSaga = generateSage<RequestThread>('REQUEST_FORUM_THREAD', fetch);

function request(token: string, props: IActionProps): Promise<IForumThreadResponse> {
    return get({ token, url: `${globals.apiUrl}/forum-thread-index/${props.id}/?page=${props.page}&size=${PAGE_SIZE}` });
}