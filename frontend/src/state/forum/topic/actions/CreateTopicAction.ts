import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import Store from '../../../store';
import globals from '../../../../utilities/globals';
import { post } from '../../../../utilities/Requestor';
import { invalidate } from '../../group/actions/ForumGroupsAction';
import { generateAuthFetch, generateSage } from '../../../sagas/generators';
import { ISingleForumTopicResponse } from '../../../../models/forums/IForumTopic';

interface IActionProps extends INewForumTopicPayload { }
export interface INewForumTopicPayload {
    group: number;
    title: string;
    description: string;
    sortOrder?: number;
}

export type RequestNewTopic = { type: 'REQUEST_NEW_FORUM_TOPIC', props: IActionProps } ;
export type ReceivedNewTopic = { type: 'RECEIVED_NEW_FORUM_TOPIC', id: number } ;
export type FailedNewTopic = { type: 'FAILED_NEW_FORUM_TOPIC', props: IActionProps };

type CreateTopicAction = RequestNewTopic | ReceivedNewTopic | FailedNewTopic;
export default CreateTopicAction;
type Action = CreateTopicAction;

function* received(response: ISingleForumTopicResponse) {
    const id = response.id;
    yield put<Action>({ type: 'RECEIVED_NEW_FORUM_TOPIC', id });
    yield put(push(`/forum/topic/${response.id}`));
    yield put(invalidate());
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_FORUM_TOPIC', props };
}

export function createForumTopic(props: INewForumTopicPayload): Action {
    return { type: 'REQUEST_NEW_FORUM_TOPIC', props };
}

function transform(state: Store.All, props: IActionProps): IActionProps {
    const group = state.sealed.forum.group.byId[props.group];
    const lastTopicId = group && group.topics && group.topics.length && group.topics[group.topics.length - 1];
    const lastTopic = state.sealed.forum.topic.byId[lastTopicId || -1];
    const sortOrder = ((lastTopic && lastTopic.sortOrder) || 1) + 1;
    return {
        group: props.group,
        title: props.title,
        description: props.description,
        sortOrder: props.sortOrder || sortOrder
    };
}

const errorPrefix = 'Creating a new forum topic failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure, transform });
export const creatForumTopicSaga = generateSage<RequestNewTopic>('REQUEST_NEW_FORUM_TOPIC', fetch);

function request(token: string, props: IActionProps): Promise<ISingleForumTopicResponse> {
    const data = {
        sortOrder: props.sortOrder,
        name: props.title,
        description: props.description,
        group: props.group
    };
    return post({ token, data, url: `${globals.apiUrl}/forum-topic-items/` });
}