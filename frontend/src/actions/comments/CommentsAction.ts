
import IUser from '../../models/IUser';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import { transformComments } from './transforms';
import IPagedResponse from '../../models/base/IPagedResponse';
import { IComment, ICommentResponse } from '../../models/IComment';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { id: number; page: number; }
const PAGE_SIZE = globals.pageSize.comments;

export type RequestComments = { type: 'REQUEST_FILM_COMMENTS', props: IActionProps };
export type ReceivedComments = {
    type: 'RECEIVED_COMMENTS',
    props: { id: number, page: number, pageSize: number, count: number, items: IComment[] },
    users: IUser[]
};
export type FailedComments = { type: 'FAILED_FILM_COMMENTS', props: IActionProps };
export type InvalidateComments = { type: 'INVALIDATE_FILM_COMMENTS', props: IActionProps };

type CommentsAction = RequestComments | ReceivedComments | FailedComments | InvalidateComments;
export default CommentsAction;
type Action = CommentsAction;

function received(response: IPagedResponse<ICommentResponse>, props: IActionProps): Action {
    const info = transformComments(response.results);
    return {
        type: 'RECEIVED_COMMENTS',
        props: {
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: info.comments
        },
        users: info.users
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM_COMMENTS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_FILM_COMMENTS', props };
}

export function getComments(id: number, page: number = 1): Action {
    return { type: 'REQUEST_FILM_COMMENTS', props: { id, page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of the comments for film (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const commentsSaga = generateSage<RequestComments>('REQUEST_FILM_COMMENTS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<ICommentResponse>> {
    return get({ token, url: `${globals.apiUrl}/film-comments/?film_id=${props.id}&page=${props.page}&size=${PAGE_SIZE}` });
}
