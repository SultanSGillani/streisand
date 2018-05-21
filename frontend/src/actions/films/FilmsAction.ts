import IFilm from '../../models/IFilm';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.films;

export type RequestFilms = { type: 'REQUEST_FILMS', props: IActionProps };
export type ReceivedFilms = { type: 'RECEIVED_FILMS', props: { page: number, pageSize: number, count: number, items: IFilm[] } };
export type FailedFilms = { type: 'FAILED_FILMS', props: IActionProps };
export type InvalidateFilms = { type: 'INVALIDATE_FILMS', props: IActionProps };

type FilmsAction = RequestFilms | ReceivedFilms | FailedFilms | InvalidateFilms;
export default FilmsAction;
type Action = FilmsAction;

function received(response: IPagedResponse<IFilm>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_FILMS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILMS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_FILMS', props };
}

export function getFilms(page: number = 1): Action {
    return { type: 'REQUEST_FILMS', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Featching page ${props.page} of films failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const filmsSaga = generateSage<RequestFilms>('REQUEST_FILMS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IFilm>> {
    return get({ token, url: `${globals.apiUrl}/films/?page=${props.page}&size=${PAGE_SIZE}` });
}