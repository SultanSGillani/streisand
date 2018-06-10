import { all } from 'redux-saga/effects';

import TorrentAction, { torrentSaga } from './TorrentAction';
import TorrentsAction, { torrentsSaga } from './TorrentsAction';
import FilmTorrentsAction, { fiomTorrentsSaga } from './FilmTorrentsAction';
import UploadTorrentAction, { uploadTorrentSaga } from './UploadTorrentAction';
import CreateTorrentAction, { createTorrentSaga } from './CreateTorrentAction';

type Action = TorrentsAction | TorrentAction | FilmTorrentsAction | UploadTorrentAction | CreateTorrentAction;
export default Action;

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        torrentsSaga(),
        fiomTorrentsSaga(),
        uploadTorrentSaga(),
        createTorrentSaga()
    ]);
}