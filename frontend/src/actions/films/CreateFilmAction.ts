import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import IFilm, { IFilmUpdate } from '../../models/IFilm';
import { received as receviedFilm } from './FilmAction';
import { generateSage, generateAuthFetch } from '../sagas/generators';

interface IActionProps extends IFilmUpdate { }

export type RequestNewFilm = { type: 'REQUEST_NEW_FILM', props: IActionProps };
export type ReceivedNewFilm = { type: 'RECEIVED_NEW_FILM', id: number };
export type FailedNewFilm = { type: 'FAILED_NEW_FILM', props: IActionProps };

type CreateFilmAction = RequestNewFilm | ReceivedNewFilm | FailedNewFilm;
export default CreateFilmAction;
type Action = CreateFilmAction;

function* received(response: IFilm) {
    const id = response.id;
    yield put(receviedFilm(response));
    yield put<Action>({ type: 'RECEIVED_NEW_FILM', id });
    yield put(push(`/film/${id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_FILM', props };
}

export function createFilm(props: IFilmUpdate): Action {
    return { type: 'REQUEST_NEW_FILM', props };
}

const errorPrefix = 'Creating a new film failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createFilmSaga = generateSage<RequestNewFilm>('REQUEST_NEW_FILM', fetch);

function request(token: string, data: IFilmUpdate): Promise<IFilm> {
    return post({ token, data, url: `${globals.apiUrl}/films/` });
}