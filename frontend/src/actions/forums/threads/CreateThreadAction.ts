import { push } from 'react-router-redux';

import Store from '../../../store';
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { invalidate } from '../topics/ForumTopicAction';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import { IUnkownError } from '../../../models/base/IError';
import ErrorAction, { handleError } from '../../ErrorAction';
import { IForumThreadResponse } from '../../../models/forums/IForumThread';

type CreateThreadAction =
    { type: 'CREATING_FORUM_THREAD', topic: number, title: string } |
    { type: 'CREATED_FORUM_THREAD', id: number } |
    { type: 'FAILED_CREATING_FORUM_THREAD' };
export default CreateThreadAction;
type Action = CreateThreadAction | ErrorAction;

export interface INewForumThreadPayload {
    topic: number;
    title: string;
}

function creating(payload: INewForumThreadPayload): Action {
    return { type: 'CREATING_FORUM_THREAD', topic: payload.topic, title: payload.title };
}

function created(id: number): Action {
    return { type: 'CREATED_FORUM_THREAD', id };
}

function failure(): Action {
    return { type: 'FAILED_CREATING_FORUM_THREAD' };
}

export function createForumThread(payload: INewForumThreadPayload): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(creating(payload));
        return create(state.sealed.auth.token, payload).then((thread: IForumThreadResponse) => {
            // We can't just use this response because it doesn't contain author information
            const action = dispatch(created(thread.id));

            // Ideally this response would include the position of the new thread so
            // we don't have to guess which page it is going to be on.
            const page = state.sealed.forums.threads.byTopic[payload.topic];
            const count = (page.count || 0) + 1;
            const lastPage = Math.ceil(count / globals.pageSize) || 1;

            // Invalidate the last page
            dispatch(invalidate({ id: payload.topic, page: lastPage }));
            // Navigate to last page
            dispatch(push(`/forum/topic/${payload.topic}/${lastPage}`));
             return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function create(token: string, data: INewForumThreadPayload): Promise<IForumThreadResponse> {
    return post({ token, data, url: `${globals.apiUrl}/forum-thread-items/` });
}