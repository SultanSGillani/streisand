import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import { transformThread } from './transforms';
import IPagedResponse from '../../models/base/IPagedResponse';
import { IForumGroupData } from '../../models/forums/IForumGroup';
import { IForumPostResponse } from '../../models/forums/IForumPost';

type Response = IPagedResponse<IForumPostResponse>;

type ForumTopicAction =
    { type: 'FETCHING_FORUM_THREAD', id: number, page: number } |
    { type: 'RECEIVED_FORUM_THREAD', id: number, page: number, count: number, data: IForumGroupData } |
    { type: 'FORUM_THREAD_FAILURE', id: number, page: number };
export default ForumTopicAction;
type Action = ForumTopicAction | ErrorAction;

type Props = {
    id: number;
    page: number;
};

function fetching(props: Props): Action {
    return { type: 'FETCHING_FORUM_THREAD', id: props.id, page: props.page };
}

function received(props: Props, response: Response): Action {
    return {
        type: 'RECEIVED_FORUM_THREAD',
        id: props.id,
        page: props.page,
        count: response.count,
        data: transformThread(response)
    };
}

function failure(props: Props): Action {
    return { type: 'FORUM_THREAD_FAILURE', id: props.id, page: props.page };
}

export function getPosts(id: number, page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of the forum thread (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: { id, page } });
}

function request(token: string, props: Props): Promise<Response> {
    return get({ token, url: `${globals.apiUrl}/forum-posts/?thread_id=${props.id}&page=${props.page}` });
}