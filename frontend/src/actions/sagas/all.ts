import { all } from 'redux-saga/effects';

import { allAuthSaga } from '../auth';
import { allFilmSaga } from '../films';
import { allUserSaga } from '../users';
import { allWikiSaga } from '../wikis';
import { newsSaga } from '../NewsAction';
import { allTorrentSaga } from '../torrents';
import { allForumSaga } from '../forums';

export default function* rootSaga() {
    yield all([
        allAuthSaga(),
        allFilmSaga(),
        allUserSaga(),
        allWikiSaga(),
        allTorrentSaga(),
        allForumSaga(),
        newsSaga()
    ]);
}