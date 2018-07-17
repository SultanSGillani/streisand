import { all } from 'redux-saga/effects';

import { releaseSaga } from './actions/ReleaseAction';
import { releasesSaga } from './actions/ReleasesAction';
import { createReleaseSaga } from './actions/CreateReleaseAction';
import { deleteReleaseSaga } from './actions/DeleteReleaseAction';
import { updateReleaseSaga } from './actions/UpdateReleaseAction';

export function* allReleaseSaga() {
    yield all([
        createReleaseSaga(),
        releasesSaga(),
        deleteReleaseSaga(),
        releaseSaga(),
        updateReleaseSaga()
    ]);
}