import { all } from 'redux-saga/effects';

import PeersAction, { peersSaga } from './PeersAction';

type Action = PeersAction;
export default Action;

export function* allPeerSaga() {
    yield all([
        peersSaga()
    ]);
}