import { all } from 'redux-saga/effects';

import ReleaseAction, { releaseSaga } from './ReleaseAction';
import ReleasesAction, { releasesSaga } from './ReleasesAction';
import CreateTorrentAction, { createReleaseSaga } from './CreateReleaseAction';
import DeleteReleaseAction, { deleteReleaseSaga } from './DeleteReleaseAction';
import UpdateReleaseAction, { updateReleaseSaga } from './UpdateReleaseAction';

type Action = ReleaseAction | ReleasesAction | CreateTorrentAction | DeleteReleaseAction | UpdateReleaseAction;
export default Action;

export function* allReleaseSaga() {
    yield all([
        createReleaseSaga(),
        releasesSaga(),
        deleteReleaseSaga(),
        releaseSaga(),
        updateReleaseSaga()
    ]);
}