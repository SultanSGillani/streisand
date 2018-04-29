import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import IFilm from '../../models/IFilm';
import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import IPagedResponse from '../../models/base/IPagedResponse';

type FilmsAction =
    { type: 'FETCHING_FILMS', page: number } |
    { type: 'RECEIVED_FILMS', page: number, count: number, films: IFilm[] } |
    { type: 'FILMS_FAILURE', page: number };
export default FilmsAction;
type Action = FilmsAction | ErrorAction;

function fetching(page: number): Action {
    return { type: 'FETCHING_FILMS', page };
}

function received(page: number, response: IPagedResponse<IFilm>): Action {
    return {
        page: page,
        count: response.count,
        type: 'RECEIVED_FILMS',
        films: response.results
    };
}

function failure(page: number): Action {
    return { type: 'FILMS_FAILURE', page };
}

export function getFilms(page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Featching page ${page} of films failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: page });
}

function request(token: string, page: number): Promise<IPagedResponse<IFilm>> {
    return get({ token, url: `${globals.apiUrl}/films/?page=${page}` });
}