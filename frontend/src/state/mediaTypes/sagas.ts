import { all } from 'redux-saga/effects';

import { mediaTypeSaga } from './actions/MediaTypeAction';

export function* allMediaTypeSaga() {
    yield all([
        mediaTypeSaga()
    ]);
}