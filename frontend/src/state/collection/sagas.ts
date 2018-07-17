import { all } from 'redux-saga/effects';

import { collectionSaga } from './actions/CollectionAction';
import { collectionsSaga } from './actions/CollectionsAction';
import { createCollectionSaga } from './actions/CreateCollectionAction';
import { deleteCollectionSaga } from './actions/DeleteCollectionAction';
import { updateCollectionSaga } from './actions/UpdateCollectionAction';

export function* allCollectionSaga() {
    yield all([
        createCollectionSaga(),
        collectionsSaga(),
        deleteCollectionSaga(),
        collectionSaga(),
        updateCollectionSaga()
    ]);
}
