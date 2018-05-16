import { push } from 'react-router-redux';

import Store from '../../../store';
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import { IUnkownError } from '../../../models/base/IError';
import ErrorAction, { handleError } from '../../ErrorAction';
import { ISingleForumThreadResponse } from '../../../models/forums/IForumThread';

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
        return create(state.sealed.auth.token, payload).then((thread: ISingleForumThreadResponse) => {
            // We can't just use this response because it doesn't contain author information
            const action = dispatch(created(thread.id));
            dispatch(push(`/forum/thread/${thread.id}`));
             return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function create(token: string, data: INewForumThreadPayload): Promise<ISingleForumThreadResponse> {
    return post({ token, data, url: `${globals.apiUrl}/forum-thread-items/` });
}