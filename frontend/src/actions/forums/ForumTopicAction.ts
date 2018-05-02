import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import { transformTopic } from './transforms';
import IPagedResponse from '../../models/base/IPagedResponse';
import { IForumGroupData } from '../../models/forums/IForumGroup';
import { IForumThreadResponse } from '../../models/forums/IForumThread';

type Response = IPagedResponse<IForumThreadResponse>;

type ForumTopicAction =
    { type: 'FETCHING_FORUM_TOPIC', id: number, page: number } |
    { type: 'RECEIVED_FORUM_TOPIC', id: number, page: number, count: number, data: IForumGroupData } |
    { type: 'FORUM_TOPIC_FAILURE', id: number, page: number };
export default ForumTopicAction;
type Action = ForumTopicAction | ErrorAction;

type Props = {
    id: number;
    page: number;
};

function fetching(props: Props): Action {
    return { type: 'FETCHING_FORUM_TOPIC', id: props.id, page: props.page };
}

function received(props: Props, response: Response): Action {
    return {
        type: 'RECEIVED_FORUM_TOPIC',
        id: props.id,
        page: props.page,
        count: response.count,
        data: transformTopic(response)
    };
}

function failure(props: Props): Action {
    return { type: 'FORUM_TOPIC_FAILURE', id: props.id, page: props.page };
}

export function getThreads(id: number, page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of the forum topic (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: { id, page } });
}

function request(token: string, props: Props): Promise<Response> {
    return get({ token, url: `${globals.apiUrl}/forum-thread-index/?topic_id=${props.id}&page=${props.page}` });
}