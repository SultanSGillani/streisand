import { all } from 'redux-saga/effects';

import { peersSaga } from './actions/PeersAction';

export function* allPeerSaga() {
    yield all([
        peersSaga()
    ]);
}