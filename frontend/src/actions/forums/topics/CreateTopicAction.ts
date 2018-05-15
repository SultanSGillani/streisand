import Store from '../../../store';
import globals from '../../../utilities/globals';
import { invalidate } from '../ForumGroupsAction';
import { post } from '../../../utilities/Requestor';
import { IUnkownError } from '../../../models/base/IError';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import ErrorAction, { handleError } from '../../ErrorAction';

export interface INewForumTopicPayload {
    group: number;
    title: string;
    description: string;
    sortOrder?: number;
}

type CreateTopicAction =
    { type: 'CREATING_FORUM_TOPIC', payload: INewForumTopicPayload } |
    { type: 'CREATED_FORUM_TOPIC', id: number } |
    { type: 'FAILED_CREATING_FORUM_TOPIC' };
export default CreateTopicAction;
type Action = CreateTopicAction | ErrorAction;

function creating(payload: INewForumTopicPayload): Action {
    return { type: 'CREATING_FORUM_TOPIC', payload };
}

function created(id: number): Action {
    return { type: 'CREATED_FORUM_TOPIC', id };
}

function failure(): Action {
    return { type: 'FAILED_CREATING_FORUM_TOPIC' };
}

export function createForumTopic(payload: INewForumTopicPayload): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(creating(payload));
        const group = state.sealed.forums.groups.byId[payload.group];
        const lastTopicId = group && group.topics && group.topics.length && group.topics[group.topics.length - 1];
        const lastTopic = state.sealed.forums.topics.byId[lastTopicId || -1];
        const sortOrder = ((lastTopic && lastTopic.sortOrder) || 1) + 1;
        payload.sortOrder = payload.sortOrder || sortOrder;
        return create(state.sealed.auth.token, payload).then((response: any) => {
            const action = dispatch(created(response.id));
            dispatch(invalidate());
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function create(token: string, payload: INewForumTopicPayload): Promise<any> {
    const data = {
        sortOrder: payload.sortOrder,
        name: payload.title,
        description: payload.description,
        group: payload.group
    };
    return post({ token, data, url: `${globals.apiUrl}/forum-topic-items/` });
}