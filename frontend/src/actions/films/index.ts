import { all } from 'redux-saga/effects';

import FilmAction, { filmSaga } from './FilmAction';
import FilmsAction, { filmsSaga } from './FilmsAction';
import CreateFilmAction, { creatFilmSaga } from './CreateFilmAction';
import DeleteFilmAction, { deleteFilmSaga } from './DeleteFilmAction';

type Action = FilmAction | FilmsAction | CreateFilmAction | DeleteFilmAction;
export default Action;

export function* allFilmSaga() {
    yield all([
        filmSaga(),
        filmsSaga(),
        deleteFilmSaga(),
        creatFilmSaga()
    ]);
}