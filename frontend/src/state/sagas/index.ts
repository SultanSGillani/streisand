import { all } from 'redux-saga/effects';

import allWikiSaga from '../wiki/sagas';
import { allAuthSaga } from '../auth/sagas';
import { allFilmSaga } from '../film/sagas';
import { allUserSaga } from '../user/sagas';
import { allNewsSaga } from '../news/sagas';
import { allPeerSaga } from '../peer/sagas';
import { allForumSaga } from '../forum/sagas';
import { allInviteSaga } from '../invite/sagas';
import { allTorrentSaga } from '../torrent/sagas';
import { allReleaseSaga } from '../release/sagas';
import { allCommentSaga } from '../comment/sagas';
import { allCollectionSaga } from '../collection/sagas';
import { allMediaTypeSaga } from '../mediaTypes/sagas';

export default function* rootSaga() {
    yield all([
        allAuthSaga(),
        allFilmSaga(),
        allUserSaga(),
        allWikiSaga(),
        allNewsSaga(),
        allPeerSaga(),
        allForumSaga(),
        allInviteSaga(),
        allTorrentSaga(),
        allReleaseSaga(),
        allCommentSaga(),
        allCollectionSaga(),
        allMediaTypeSaga()
    ]);
}
