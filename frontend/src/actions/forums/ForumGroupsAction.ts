import { put } from 'redux-saga/effects';

import globals from '../../utilities/globals';
import { transformGroups } from './transforms';
import { get } from '../../utilities/Requestor';
import { getUsers } from '../users/BulkUserAction';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import { IForumGroupResponse, IForumGroupData } from '../../models/forums/IForumGroup';

export type RequestForumGroups = { type: 'REQUEST_FORUM_GROUPS' };
export type ReceivedForumGroups = { type: 'RECEIVED_FORUM_GROUPS', props: { data: IForumGroupData } };
export type FailedForumGroups = { type: 'FAILED_FORUM_GROUPS' };
export type InvalidateForumGroups = { type: 'INVALIDATE_FORUM_GROUPS' };

type ForumGroupsction = RequestForumGroups | ReceivedForumGroups | FailedForumGroups | InvalidateForumGroups;
export default ForumGroupsction;
type Action = ForumGroupsction;

function* received(response: IForumGroupResponse) {
    const data = transformGroups(response);
    yield put<Action>({ type: 'RECEIVED_FORUM_GROUPS', props: { data } });
    if (data.users.length) {
        yield put(getUsers(data.users));
    }
}

function failure(): Action {
    return { type: 'FAILED_FORUM_GROUPS' };
}

export function invalidate() {
    return { type: 'INVALIDATE_FORUM_GROUPS' };
}

export function getForumGroups(): Action {
    return { type: 'REQUEST_FORUM_GROUPS' };
}
const errorPrefix = 'Fetching the list of forums failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const forumGroupsSaga = generateSage<RequestForumGroups>('REQUEST_FORUM_GROUPS', fetch);

function request(token: string): Promise<IForumGroupResponse> {
    return get({ token, url: `${globals.apiUrl}/forum-index/` });
}