
import globals from '../../utilities/globals';
import { transformComment } from './transforms';
import { putRequest } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import { ICommentUpdate, ICommentResponse, IComment } from '../../models/IComment';

interface IActionProps extends ICommentUpdate { id: number; }

export type RequestCommentUpdate = { type: 'REQUEST_COMMENT_UPDATE', props: IActionProps };
export type ReceivedtCommentUpdate = { type: 'RECEIVED_COMMENT_UPDATE', comment: IComment };
export type FailedCommentUpdate = { type: 'FAILED_COMMENT_UPDATE', props: IActionProps };

type CommentUpdateAction = RequestCommentUpdate | ReceivedtCommentUpdate | FailedCommentUpdate;
export default CommentUpdateAction;
type Action = CommentUpdateAction;

function received(response: ICommentResponse): Action {
    const info = transformComment(response);
    return { type: 'RECEIVED_COMMENT_UPDATE', comment: info.comment };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_COMMENT_UPDATE', props };
}

export function updateComment(id: number, text: string): Action {
    return { type: 'REQUEST_COMMENT_UPDATE', props: { id, text } };
}

const errorPrefix = (props: IActionProps) => `Updating a comment (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateCommentSaga = generateSage<RequestCommentUpdate>('REQUEST_COMMENT_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<ICommentResponse> {
    const { id, ...data } = props;
    return putRequest({ token, data, url: `${globals.apiUrl}/film-comments/${id}/` });
}