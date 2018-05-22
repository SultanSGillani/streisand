
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    group?: number;
    topic: number;
}

export type RequestTopicDeletion = { type: 'REQUEST_FORUM_TOPIC_DELETION', props: IActionProps } ;
export type ReceivedTopicDeletion = { type: 'RECEIVED_FORUM_TOPIC_DELETION', props: IActionProps } ;
export type FailedTopicDeletion = { type: 'FAILED_FORUM_TOPIC_DELETION', props: IActionProps };

type DeleteTopicAction = RequestTopicDeletion | ReceivedTopicDeletion | FailedTopicDeletion;
export default DeleteTopicAction;
type Action = DeleteTopicAction;

function received(response: void, props: IActionProps): Action {
    return { type: 'RECEIVED_FORUM_TOPIC_DELETION', props };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_TOPIC_DELETION', props };
}

export function deleteForumTopic(props: IActionProps): Action {
    return { type: 'REQUEST_FORUM_TOPIC_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a forum topic (${props.topic}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteForumTopicSaga = generateSage<RequestTopicDeletion>('REQUEST_FORUM_TOPIC_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/forum-topic-items/${props.topic}/` });
}