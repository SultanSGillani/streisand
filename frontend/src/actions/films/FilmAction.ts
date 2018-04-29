import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import IFilm from '../../models/IFilm';
import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';

type FilmAction =
    { type: 'FETCHING_FILM', id: number } |
    { type: 'RECEIVED_FILM', film: IFilm } |
    { type: 'FILM_FAILURE', id: number };
export default FilmAction;
type Action = FilmAction | ErrorAction;

function fetching(id: number): Action {
    return { type: 'FETCHING_FILM', id };
}

function received(id: number, response: IFilm): Action {
    return {
        type: 'RECEIVED_FILM',
        film: response
    };
}

function failure(id: number): Action {
    return { type: 'FILM_FAILURE', id };
}

export function getFilm(id: number): ThunkAction<Action> {
    const errorPrefix = `Fetching film (${id}) failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: id });
}

function request(token: string, id: number): Promise<IFilm> {
    return get({ token, url: `${globals.apiUrl}/films/${id}/` });
}