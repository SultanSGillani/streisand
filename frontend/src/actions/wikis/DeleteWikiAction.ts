import { push } from 'react-router-redux';

import Store from '../../store';
import { invalidate } from './WikisAction';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';
import { IUnkownError } from '../../models/base/IError';
import ErrorAction, { handleError } from '../ErrorAction';

type DeleteWikiAction =
    { type: 'DELETING_WIKI', id: number } |
    { type: 'DELETED_WIKI', id: number } |
    { type: 'FAILED_DELETING_WIKI', id: number };
export default DeleteWikiAction;
type Action = DeleteWikiAction | ErrorAction;

export interface IDeleteProps {
    id: number;
    currentPage?: number;
}

function deleting(id: number): Action {
    return { type: 'DELETING_WIKI', id };
}

function deleted(id: number): Action {
    return { type: 'DELETED_WIKI', id };
}

function failure(id: number): Action {
    return { type: 'FAILED_DELETING_WIKI', id };
}

export function deleteWiki(props: IDeleteProps): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(deleting(props.id));
        return request(state.sealed.auth.token, props.id).then(() => {
            if (props.currentPage) {
                dispatch(invalidate(props.currentPage));
            } else {
                dispatch(push('/wikis'));
            }
            return dispatch(deleted(props.id));
        }, (error: IUnkownError) => {
            dispatch(failure(props.id));
            return dispatch(handleError(error));
        });
    };
}

function request(token: string, id: number): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/wikis/${id}/` });
}