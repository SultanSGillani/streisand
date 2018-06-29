import { all } from 'redux-saga/effects';

import FilmAction, { filmSaga } from './FilmAction';
import FilmsAction, { filmsSaga } from './FilmsAction';
import CreateFilmAction, { createFilmSaga } from './CreateFilmAction';
import DeleteFilmAction, { deleteFilmSaga } from './DeleteFilmAction';
import UpdateFilmAction, { updateFilmSaga } from './UpdateFilmAction';
import FilmSearchAction, { filmSearchSaga } from './FilmsSearchAction';

type Action = FilmAction | FilmsAction | CreateFilmAction | DeleteFilmAction | FilmSearchAction | UpdateFilmAction;
export default Action;

export function* allFilmSaga() {
    yield all([
        filmSaga(),
        filmsSaga(),
        deleteFilmSaga(),
        createFilmSaga(),
        filmSearchSaga(),
        updateFilmSaga()
    ]);
}