import { all } from 'redux-saga/effects';

import TorrentAction, { torrentSaga } from './TorrentAction';
import TorrentsAction, { torrentsSaga } from './TorrentsAction';
import FilmTorrentsAction, { fiomTorrentsSaga } from './FilmTorrentsAction';
import UploadTorrentAction, { uploadTorrentSaga } from './UploadTorrentAction';
import UpdateTorrentAction, { updateTorrentSaga } from './UpdateTorrentAction';

type Action = TorrentsAction | TorrentAction | FilmTorrentsAction | UploadTorrentAction | UpdateTorrentAction;
export default Action;

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        torrentsSaga(),
        fiomTorrentsSaga(),
        uploadTorrentSaga(),
        updateTorrentSaga()
    ]);
}