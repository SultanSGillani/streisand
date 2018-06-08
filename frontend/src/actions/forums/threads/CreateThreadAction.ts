import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../sagas/generators';
import { ISingleForumThreadResponse } from '../../../models/forums/IForumThread';

export interface IActionProps extends INewForumThreadPayload {}
export interface INewForumThreadPayload { topic: number; title: string; }

export type RequestNewThread = { type: 'REQUEST_NEW_FORUM_THREAD',  props: IActionProps } ;
export type ReceivedNewThread = { type: 'RECEIVED_NEW_FORUM_THREAD', id: number } ;
export type FailedNewThread = { type: 'FAILED_NEW_FORUM_THREAD',  props: IActionProps };

type CreateThreadAction = RequestNewThread | ReceivedNewThread |FailedNewThread;
export default CreateThreadAction;
type Action = CreateThreadAction;

function* received(response: ISingleForumThreadResponse, props: IActionProps) {
    const id = response.id;
    // We can't just use this response because it doesn't contain author information
    yield put<Action>({ type: 'RECEIVED_NEW_FORUM_THREAD', id });
    yield put(push(`/forum/thread/${id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_FORUM_THREAD', props };
}

export function createForumThread(props: INewForumThreadPayload): Action {
    return { type: 'REQUEST_NEW_FORUM_THREAD', props };
}

const errorPrefix = 'Creating a new forum thread failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const creatForumThreadSaga = generateSage<RequestNewThread>('REQUEST_NEW_FORUM_THREAD', fetch);

function request(token: string, data: IActionProps): Promise<ISingleForumThreadResponse> {
    return post({ token, data, url: `${globals.apiUrl}/forum-thread-items/` });
}