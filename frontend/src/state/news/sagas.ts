import { all } from 'redux-saga/effects';

import { newsSaga } from './actions/NewsAction';

export function* allNewsSaga() {
    yield all([
        newsSaga()
    ]);
}