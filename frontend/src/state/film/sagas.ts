import { all } from 'redux-saga/effects';

import { filmSaga } from './actions/FilmAction';
import { filmsSaga } from './actions/FilmsAction';
import { deleteFilmSaga } from './actions/DeleteFilmAction';
import { createFilmSaga } from './actions/CreateFilmAction';
import { filmSearchSaga } from './actions/FilmsSearchAction';
import { updateFilmSaga } from './actions/UpdateFilmAction';

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