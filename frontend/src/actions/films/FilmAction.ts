
import IFilm from '../../models/IFilm';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { id: number; }

export type RequestFilm = { type: 'REQUEST_FILM', props: IActionProps };
export type ReceivedFilm = { type: 'RECEIVED_FILM', film: IFilm };
export type FailedFilm = { type: 'FAILED_FILM', props: IActionProps };

type FilmAction = RequestFilm | ReceivedFilm | FailedFilm;
export default FilmAction;
type Action = FilmAction;

export function received(film: IFilm): Action {
    return { type: 'RECEIVED_FILM', film };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM', props };
}

export function getFilm(id: number): Action {
    return { type: 'REQUEST_FILM', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching film (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const filmSaga = generateSage<RequestFilm>('REQUEST_FILM', fetch);

function request(token: string, props: IActionProps): Promise<IFilm> {
    return get({ token, url: `${globals.apiUrl}/films/${props.id}/` });
}