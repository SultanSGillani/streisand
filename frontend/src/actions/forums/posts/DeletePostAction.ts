import Store from '../../../store';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { invalidate } from '../threads/ForumThreadAction';
import { IUnkownError } from '../../../models/base/IError';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import ErrorAction, { handleError } from '../../ErrorAction';

type DeletePostAction =
    { type: 'DELETING_FORUM_POST', id: number } |
    { type: 'DELETED_FORUM_POST', id: number } |
    { type: 'FAILED_DELETING_FORUM_POST', id: number };
export default DeletePostAction;
type Action = DeletePostAction | ErrorAction;

export interface IDeletePostProps {
    thread: number;
    post: number;
    currentPage: number;
}

function deleting(id: number): Action {
    return { type: 'DELETING_FORUM_POST', id };
}

function deleted(id: number): Action {
    return { type: 'DELETED_FORUM_POST', id };
}

function failure(id: number): Action {
    return { type: 'FAILED_DELETING_FORUM_POST', id };
}

export function deleteForumPost(props: IDeletePostProps): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(deleting(props.thread));
        return deletePost(state.sealed.auth.token, props.thread).then(() => {
            const action = dispatch(deleted(props.post));
            dispatch(invalidate({ id: props.thread, page: props.currentPage }));
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure(props.thread));
            return dispatch(handleError(error));
        });
    };
}

function deletePost(token: string, id: number): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/forum-posts/${id}/` });
}