import { all } from 'redux-saga/effects';

import TorrentAction, { torrentSaga } from './TorrentAction';
import TorrentsAction, { torrentsSaga } from './TorrentsAction';
import FilmTorrentsAction, { fiomTorrentsSaga } from './FilmTorrentsAction';
import UploadTorrentAction, { uploadTorrentSaga } from './UploadTorrentAction';

type Action = TorrentsAction | TorrentAction | FilmTorrentsAction | UploadTorrentAction;
export default Action;

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        torrentsSaga(),
        fiomTorrentsSaga(),
        uploadTorrentSaga()
    ]);
}