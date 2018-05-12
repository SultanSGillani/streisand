import { push } from 'react-router-redux';

import Store from '../../store';
import WikiAction from './FilmAction';
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';
import { IUnkownError } from '../../models/base/IError';
import IFilm, { IFilmUpdate } from '../../models/IFilm';
import ErrorAction, { handleError } from '../ErrorAction';

type CreateFilmAction =
    { type: 'CREATING_FILM', film: IFilmUpdate } |
    { type: 'CREATED_FILM', id: number } |
    { type: 'FAILED_CREATING_FILM' };
export default CreateFilmAction;
type Action = CreateFilmAction | WikiAction | ErrorAction;

function received(id: number, film: IFilm): Action {
    return { type: 'RECEIVED_FILM', film };
}

function creating(film: IFilmUpdate): Action {
    return { type: 'CREATING_FILM', film };
}

function created(id: number): Action {
    return { type: 'CREATED_FILM', id };
}

function failure(): Action {
    return { type: 'FAILED_CREATING_FILM' };
}

export function createFilm(film: IFilmUpdate): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(creating(film));
        return request(state.sealed.auth.token, film).then((response: IFilm) => {
            dispatch(received(response.id, response));
            const action = dispatch(created(response.id));
            dispatch(push(`/film/${response.id}`));
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function request(token: string, data: IFilmUpdate): Promise<IFilm> {
    return post({ token, data, url: `${globals.apiUrl}/films/` });
}