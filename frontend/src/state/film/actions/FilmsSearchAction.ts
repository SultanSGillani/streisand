
import IFilm from '../../../models/IFilm';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IPagedResponse from '../../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IFilmSearchProps {
    page: number;
    title?: string;
    description?: string;
    tags?: string;
    year?: number;
    advanced?: boolean;
}

interface IActionProps extends IFilmSearchProps { }

export type RequestFilms = { type: 'REQUEST_FILM_SEARCH', props: IActionProps };
export type ReceivedFilms = { type: 'RECEIVED_FILM_SEARCH', props: { page: number, pageSize: number, count: number, items: IFilm[] } };
export type FailedFilms = { type: 'FAILED_FILM_SEARCH', props: IActionProps };

type FilmSearchAction = RequestFilms | ReceivedFilms | FailedFilms;
export default FilmSearchAction;
type Action = FilmSearchAction;

function received(response: IPagedResponse<IFilm>, props: IActionProps): Action {
    const pageSize = props.advanced ? globals.pageSize.films : globals.pageSize.simpleSearch;
    return {
        type: 'RECEIVED_FILM_SEARCH',
        props: {
            page: props.page,
            pageSize: pageSize,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM_SEARCH', props };
}

export function searchFilm(props: IFilmSearchProps): Action {
    return { type: 'REQUEST_FILM_SEARCH', props };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of film search failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const filmSearchSaga = generateSage<RequestFilms>('REQUEST_FILM_SEARCH', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IFilm>> {
    const pageSize = props.advanced ? globals.pageSize.films : globals.pageSize.simpleSearch;
    const search = `&title=${props.title || ''}&year=${props.year || ''}&description=${props.description || ''}&tags=${props.tags || ''}`;
    return get({ token, url: `${globals.apiUrl}/films/?page=${props.page}&size=${pageSize}${search}` });
}