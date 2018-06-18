import { all } from 'redux-saga/effects';

import TorrentAction, { torrentSaga } from './TorrentAction';
import FilmTorrentsAction, { filmTorrentsSaga } from './FilmTorrentsAction';
import UploadTorrentAction, { uploadTorrentSaga } from './UploadTorrentAction';
import UpdateTorrentAction, { updateTorrentSaga } from './UpdateTorrentAction';
import DeleteTorrentAction, { deleteTorrentSaga } from './DeleteTorrentAction';
import DetachedTorrentsAction, { detachedTorrentsSaga } from './DetachedTorrentsAction';

type Action = TorrentAction | FilmTorrentsAction | UploadTorrentAction | UpdateTorrentAction | DetachedTorrentsAction | DeleteTorrentAction;
export default Action;

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        filmTorrentsSaga(),
        uploadTorrentSaga(),
        updateTorrentSaga(),
        detachedTorrentsSaga(),
        deleteTorrentSaga()
    ]);
}