import Store from '../../../store';
import ErrorAction from '../../ErrorAction';
import { transformTopic } from '../transforms';
import { fetchData } from '../../ActionHelper';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import { IForumGroupData } from '../../../models/forums/IForumGroup';
import BulkUserAction, { getUsers } from '../../users/BulkUserAction';
import { IForumTopicResponse } from '../../../models/forums/IForumTopic';

const PAGE_SIZE = globals.pageSize.threads;
export type ForumTopicReceivedAction = {
    type: 'RECEIVED_FORUM_TOPIC',
    id: number,
    page: number,
    count: number,
    pageSize: number;
    data: IForumGroupData
};

type ForumTopicAction =
    { type: 'FETCHING_FORUM_TOPIC', id: number, page: number } |
    ForumTopicReceivedAction |
    { type: 'FAILED_FORUM_TOPIC', id: number, page: number } |
    { type: 'INVALIDATE_FORUM_TOPIC', id: number, page: number };
export default ForumTopicAction;
type Action = ForumTopicAction | BulkUserAction | ErrorAction;

type Props = {
    id: number;
    page: number;
};

function fetching(props: Props): Action {
    return { type: 'FETCHING_FORUM_TOPIC', id: props.id, page: props.page };
}

function received(props: Props, response: IForumTopicResponse): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const data = transformTopic(response);
        if (data.users.length) {
            dispatch(getUsers(data.users));
        }
        return dispatch({
            type: 'RECEIVED_FORUM_TOPIC',
            id: props.id,
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.threads.count,
            data: data
        });
    };
}

function failure(props: Props): Action {
    return { type: 'FAILED_FORUM_TOPIC', id: props.id, page: props.page };
}

export function invalidate(props: Props): Action {
    return { type: 'INVALIDATE_FORUM_TOPIC', id: props.id, page: props.page };
}

export function getThreads(id: number, page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of the forum topic (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: { id, page } });
}

function request(token: string, props: Props): Promise<IForumTopicResponse> {
    return get({ token, url: `${globals.apiUrl}/forum-topic-index/${props.id}/?page=${props.page}&size=${PAGE_SIZE}` });
}