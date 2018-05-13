
import Store from '../../store';
import { invalidate } from './FilmsAction';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';
import { IUnkownError } from '../../models/base/IError';
import ErrorAction, { handleError } from '../ErrorAction';

type DeleteFilmAction =
    { type: 'DELETING_FILM', id: number } |
    { type: 'DELETED_FILM', id: number } |
    { type: 'FAILED_DELETING_FILM', id: number };
export default DeleteFilmAction;
type Action = DeleteFilmAction | ErrorAction;

export interface IDeleteProps {
    id: number;
    currentPage: number;
}

function deleting(id: number): Action {
    return { type: 'DELETING_FILM', id };
}

function deleted(id: number): Action {
    return { type: 'DELETED_FILM', id };
}

function failure(id: number): Action {
    return { type: 'FAILED_DELETING_FILM', id };
}

export function deleteFilm(props: IDeleteProps): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(deleting(props.id));
        return request(state.sealed.auth.token, props.id).then(() => {
            dispatch(invalidate(props.currentPage));
            return dispatch(deleted(props.id));
        }, (error: IUnkownError) => {
            dispatch(failure(props.id));
            return dispatch(handleError(error));
        });
    };
}

function request(token: string, id: number): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/films/${id}/` });
}