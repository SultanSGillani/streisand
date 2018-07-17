import { all } from 'redux-saga/effects';

import { torrentSaga } from './actions/TorrentAction';
import { filmTorrentsSaga } from './actions/FilmTorrentsAction';
import { uploadTorrentSaga } from './actions/UploadTorrentAction';
import { updateTorrentSaga } from './actions/UpdateTorrentAction';
import { deleteTorrentSaga } from './actions/DeleteTorrentAction';
import { releaseTorrentsSaga } from './actions/ReleaseTorrentsAction';
import { detachedTorrentsSaga } from './actions/DetachedTorrentsAction';

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        filmTorrentsSaga(),
        uploadTorrentSaga(),
        updateTorrentSaga(),
        detachedTorrentsSaga(),
        deleteTorrentSaga(),
        releaseTorrentsSaga()
    ]);
}