import { put } from 'redux-saga/effects';

import { invalidate } from './FilmsAction';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

export interface IActionProps {
    id: number;
    currentPage: number;
}

export type RequestFilmDeletion = { type: 'REQUEST_FILM_DELETION', props: IActionProps };
export type ReceivedFilmDeletion = { type: 'RECEIVED_FILM_DELETION', props: IActionProps };
export type FailedFilmDeletion = { type: 'FAILED_FILM_DELETION', props: IActionProps };

type DeleteFilmAction = RequestFilmDeletion | ReceivedFilmDeletion | FailedFilmDeletion;
export default DeleteFilmAction;
type Action = DeleteFilmAction;

function* received(response: void, props: IActionProps) {
    yield put({ type: 'RECEIVED_FILM_DELETION', props });
    yield put(invalidate({ page: props.currentPage }));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_FILM_DELETION', props };
}

export function deleteFilm(props: IActionProps): Action {
    return { type: 'REQUEST_FILM_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a film (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteFilmSaga = generateSage<RequestFilmDeletion>('REQUEST_FILM_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/films/${props.id}/` });
}