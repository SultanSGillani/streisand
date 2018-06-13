import { all } from 'redux-saga/effects';

import CreateTorrentAction, { createReleaseSaga } from './CreateReleaseAction';

type Action =  CreateTorrentAction;
export default Action;

export function* allReleaseSaga() {
    yield all([
        createReleaseSaga()
    ]);
}