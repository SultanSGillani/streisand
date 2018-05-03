import Store from '../../store';
import globals from '../../utilities/globals';
import { invalidate } from './ForumGroupsAction';
import { remove } from '../../utilities/Requestor';
import { IUnkownError } from '../../models/base/IError';
import { ThunkAction, IDispatch } from '../ActionTypes';
import ErrorAction, { handleError } from '../ErrorAction';

type DeleteTopicAction =
    { type: 'DELETING_FORUM_TOPIC', id: number } |
    { type: 'DELETED_FORUM_TOPIC', id: number } |
    { type: 'FAILED_DELETING_FORUM_TOPIC', id: number };
export default DeleteTopicAction;
type Action = DeleteTopicAction | ErrorAction;

function deleting(id: number): Action {
    return { type: 'DELETING_FORUM_TOPIC', id };
}

function deleted(id: number): Action {
    return { type: 'DELETED_FORUM_TOPIC', id };
}

function failure(id: number): Action {
    return { type: 'FAILED_DELETING_FORUM_TOPIC', id };
}

export function deleteForumTopic(id: number): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(deleting(id));
        return deleteTopic(state.sealed.auth.token, id).then((response: any) => {
            const action = dispatch(deleted(response.id));
            dispatch(invalidate());
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure(id));
            return dispatch(handleError(error));
        });
    };
}

function deleteTopic(token: string, id: number): Promise<any> {
    return remove({ token, url: `${globals.apiUrl}/forum-topics/${id}` });
}