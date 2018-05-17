import Store from '../../store';
import ErrorAction from '../ErrorAction';
import globals from '../../utilities/globals';
import { transformGroups } from './transforms';
import { get } from '../../utilities/Requestor';
import { simplefetchData } from '../ActionHelper';
import { ThunkAction, IDispatch } from '../ActionTypes';
import BulkUserAction, { getUsers } from '../users/BulkUserAction';
import { IForumGroupResponse, IForumGroupData } from '../../models/forums/IForumGroup';

type ForumGroupsction =
    { type: 'FETCHING_FORUM_GROUPS' } |
    { type: 'RECEIVED_FORUM_GROUPS', data: IForumGroupData } |
    { type: 'FAILED_FORUM_GROUPS' } |
    { type: 'INVALIDATE_FORUM_GROUPS' };
export default ForumGroupsction;
type Action = ForumGroupsction | BulkUserAction | ErrorAction;

function fetching(): Action {
    return { type: 'FETCHING_FORUM_GROUPS' };
}

function received(response: IForumGroupResponse): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const data = transformGroups(response);
        if (data.users.length) {
            dispatch(getUsers(data.users));
        }
        return dispatch({
            type: 'RECEIVED_FORUM_GROUPS',
            data: data
        });
    };
}

function failure(): Action {
    return { type: 'FAILED_FORUM_GROUPS' };
}

export function invalidate() {
    return { type: 'INVALIDATE_FORUM_GROUPS' };
}

export function getForumGroups(): ThunkAction<Action> {
    const errorPrefix = 'Fetching the list of forums failed';
    return simplefetchData({ request, fetching, received, failure, errorPrefix });
}

function request(token: string): Promise<IForumGroupResponse> {
    return get({ token, url: `${globals.apiUrl}/forum-index/` });
}