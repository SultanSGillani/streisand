import { all } from 'redux-saga/effects';

import { allAuthSaga } from '../auth';
import { newsSaga } from '../NewsAction';
import { allFilmSaga } from '../films';
import { allUserSaga } from '../users';
import { allWikiSaga } from '../wikis';

export default function* rootSaga() {
    yield all([
        allAuthSaga(),
        allFilmSaga(),
        allUserSaga(),
        allWikiSaga(),
        newsSaga()
    ]);
}