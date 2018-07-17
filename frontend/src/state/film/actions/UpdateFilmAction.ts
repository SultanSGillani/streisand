import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../../utilities/globals';
import { patch } from '../../../utilities/Requestor';
import IFilm, { IFilmUpdate } from '../../../models/IFilm';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

interface IActionProps extends Partial<IFilmUpdate> { id: number; }

export type RequestFilmUpdate = { type: 'REQUEST_FILM_UPDATE', props: IActionProps };
export type ReceivedFilmUpdate = { type: 'RECEIVED_FILM_UPDATE', film: IFilm };
export type FailedFilmUpdate = { type: 'FAILED_FILM_UPDATE', props: IActionProps };

type UpdateFilmAction = RequestFilmUpdate | ReceivedFilmUpdate | FailedFilmUpdate;
export default UpdateFilmAction;
type Action = UpdateFilmAction;

function* received(film: IFilm) {
    yield put<Action>({ type: 'RECEIVED_FILM_UPDATE', film });
    yield put(push(`/film/${film.id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM_UPDATE', props };
}

export function updateFilm(id: number, film: Partial<IFilmUpdate>): Action {
    return { type: 'REQUEST_FILM_UPDATE', props: { id, ...film } };
}

const errorPrefix = (props: IActionProps) => `Update a film (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateFilmSaga = generateSage<RequestFilmUpdate>('REQUEST_FILM_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<IFilm> {
    const { id, ...data } = props;
    return patch({ token, data, url: `${globals.apiUrl}/films/${id}/` });
}