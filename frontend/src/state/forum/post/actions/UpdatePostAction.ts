
import { transformPostOnly } from './transforms';
import globals from '../../../../utilities/globals';
import { patch } from '../../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../../sagas/generators';
import { IForumPost, IForumPostResponse } from '../../../../models/forums/IForumPost';

interface IActionProps { id: number; content: string; }

export type RequestPostUpdate = { type: 'REQUEST_FORUM_POST_UPDATE', props: IActionProps } ;
export type ReceivedPostUpdate = { type: 'RECEIVED_FORUM_POST_UPDATE', post: IForumPost } ;
export type FailedPostUpdate = { type: 'FAILED_FORUM_POST_UODATE', props: IActionProps };

type UpdatePostAction = RequestPostUpdate | ReceivedPostUpdate | FailedPostUpdate;
export default UpdatePostAction;
type Action = UpdatePostAction;

function received(response: IForumPostResponse): Action {
    return {
        type: 'RECEIVED_FORUM_POST_UPDATE',
        post: transformPostOnly(response)
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FORUM_POST_UODATE', props };
}

export function updatePost(id: number, content: string): Action {
    return { type: 'REQUEST_FORUM_POST_UPDATE', props: {id, content} };
}

const errorPrefix = (props: IActionProps) => `Updating a forum post (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateForumPostSaga = generateSage<RequestPostUpdate>('REQUEST_FORUM_POST_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<IForumPostResponse> {
    const data = { body: props.content };
    return patch({ token, url: `${globals.apiUrl}/forum-post-items/${props.id}/`, data });
}