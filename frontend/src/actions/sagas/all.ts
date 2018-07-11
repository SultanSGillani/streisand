import { all } from 'redux-saga/effects';

import { allAuthSaga } from '../auth';
import { allFilmSaga } from '../films';
import { allUserSaga } from '../users';
import { allWikiSaga } from '../wikis';
import { newsSaga } from '../NewsAction';
import { allForumSaga } from '../forums';
import { allTorrentSaga } from '../torrents';
import { allReleaseSaga } from '../releases';
import { mediaTypeSaga } from '../MediaTypeAction';
import { allInviteSaga } from '../invites';
import { allPeerSaga } from '../peers';

export default function* rootSaga() {
    yield all([
        allAuthSaga(),
        allFilmSaga(),
        allUserSaga(),
        allWikiSaga(),
        allTorrentSaga(),
        allForumSaga(),
        allReleaseSaga(),
        newsSaga(),
        mediaTypeSaga(),
        allInviteSaga(),
        allPeerSaga()
    ]);
}