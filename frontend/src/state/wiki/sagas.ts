import { all } from 'redux-saga/effects';

import { wikiSaga } from './actions/WikiAction';
import { wikisSaga } from './actions/WikisAction';
import { updateWikiSaga } from './actions/UpdateWikiAction';
import { createWikiSaga } from './actions/CreateWikiAction';
import { deleteWikiSaga } from './actions/DeleteWikiAction';

export default function* allWikiSaga() {
    yield all([
        wikiSaga(),
        wikisSaga(),
        updateWikiSaga(),
        createWikiSaga(),
        deleteWikiSaga()
    ]);
}