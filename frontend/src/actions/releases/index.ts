import { all } from 'redux-saga/effects';

import ReleasesAction, { releasesSaga } from './ReleasesAction';
import CreateTorrentAction, { createReleaseSaga } from './CreateReleaseAction';

type Action = ReleasesAction | CreateTorrentAction;
export default Action;

export function* allReleaseSaga() {
    yield all([
        createReleaseSaga(),
        releasesSaga()
    ]);
}