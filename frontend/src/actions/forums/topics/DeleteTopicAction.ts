
import Store from '../../../store';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { IUnkownError } from '../../../models/base/IError';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import ErrorAction, { handleError } from '../../ErrorAction';

type DeleteTopicAction =
    { type: 'DELETING_FORUM_TOPIC', group?: number, topic: number } |
    { type: 'DELETED_FORUM_TOPIC', group?: number, topic: number } |
    { type: 'FAILED_DELETING_FORUM_TOPIC', group?: number, topic: number };
export default DeleteTopicAction;
type Action = DeleteTopicAction | ErrorAction;

export interface IDeleteTopicProps {
    group?: number;
    topic: number;
}

function deleting(props: IDeleteTopicProps): Action {
    return { type: 'DELETING_FORUM_TOPIC', ...props };
}

function deleted(props: IDeleteTopicProps): Action {
    return { type: 'DELETED_FORUM_TOPIC', ...props };
}

function failure(props: IDeleteTopicProps): Action {
    return { type: 'FAILED_DELETING_FORUM_TOPIC', ...props };
}

export function deleteForumTopic(props: IDeleteTopicProps): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(deleting(props));
        return deleteTopic(state.sealed.auth.token, props.topic).then(() => {
            return dispatch(deleted(props));
        }, (error: IUnkownError) => {
            dispatch(failure(props));
            return dispatch(handleError(error));
        });
    };
}

function deleteTopic(token: string, id: number): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/forum-topics/${id}/` });
}