import { put } from 'redux-saga/effects';

import { transformTopic } from '../transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import { getUsers } from '../../users/BulkUserAction';
import { IForumGroupData } from '../../../models/forums/IForumGroup';
import { IForumTopicResponse } from '../../../models/forums/IForumTopic';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.threads;

export type RequestForumTopic = { type: 'REQUEST_FORUM_TOPIC', props: IActionProps };
export type ReceivedForumTopic = {
    type: 'RECEIVED_FORUM_TOPIC',
    props: { id: number, page: number, count: number, pageSize: number; data: IForumGroupData }
};
export type FailedForumTopic = { type: 'FAILED_FORUM_TOPIC', props: IActionProps };
export type InvalidateForumTopic = { type: 'INVALIDATE_FORUM_TOPIC', props: IActionProps };

type ForumTopicAction = RequestForumTopic | ReceivedForumTopic | FailedForumTopic | InvalidateForumTopic;
export default ForumTopicAction;
type Action = ForumTopicAction;

function* received(response: IForumTopicResponse, props: IActionProps) {
    const data = transformTopic(response);
    yield put({
        type: 'RECEIVED_FORUM_TOPIC',
        props: {
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.threads.count,
            data: data
        }
    });

    if (data.users.length) {
        yield put(getUsers(data.users));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_TOPIC', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_FORUM_TOPIC', props };
}

export function getThreads(id: number, page: number = 1): Action {
    return { type: 'REQUEST_FORUM_TOPIC', props: { id, page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the forum topic (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const forumTopicSaga = generateSage<RequestForumTopic>('REQUEST_FORUM_TOPIC', fetch);

function request(token: string, props: IActionProps): Promise<IForumTopicResponse> {
    return get({ token, url: `${globals.apiUrl}/forum-topic-index/${props.id}/?page=${props.page}&size=${PAGE_SIZE}` });
}