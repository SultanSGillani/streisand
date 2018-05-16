import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import IFilm from '../../models/IFilm';
import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import IPagedResponse from '../../models/base/IPagedResponse';

const PAGE_SIZE = globals.pageSize.films;
type FilmsAction =
    { type: 'FETCHING_FILMS', page: number } |
    { type: 'RECEIVED_FILMS', page: number, pageSize: number, count: number, items: IFilm[] } |
    { type: 'FAILED_FILMS', page: number } |
    { type: 'INVALIDATE_FILMS', page: number };
export default FilmsAction;
type Action = FilmsAction | ErrorAction;

function fetching(page: number): Action {
    return { type: 'FETCHING_FILMS', page };
}

function received(page: number, response: IPagedResponse<IFilm>): Action {
    return {
        page: page,
        pageSize: PAGE_SIZE,
        count: response.count,
        type: 'RECEIVED_FILMS',
        items: response.results
    };
}

function failure(page: number): Action {
    return { type: 'FAILED_FILMS', page };
}

export function invalidate(page: number): Action {
    return { type: 'INVALIDATE_FILMS', page };
}

export function getFilms(page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Featching page ${page} of films failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: page });
}

function request(token: string, page: number): Promise<IPagedResponse<IFilm>> {
    return get({ token, url: `${globals.apiUrl}/films/?page=${page}&size=${PAGE_SIZE}` });
}