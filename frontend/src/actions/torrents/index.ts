import { all } from 'redux-saga/effects';

import TorrentAction, { torrentSaga } from './TorrentAction';
import TorrentsAction, { torrentsSaga } from './TorrentsAction';
import FilmTorrentsAction, { fiomTorrentsSaga } from './FilmTorrentsAction';

type Action = TorrentsAction | TorrentAction | FilmTorrentsAction;
export default Action;

export function* allTorrentSaga() {
    yield all([
        torrentSaga(),
        torrentsSaga(),
        fiomTorrentsSaga()
    ]);
}