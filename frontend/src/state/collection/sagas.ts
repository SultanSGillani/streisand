import { all } from 'redux-saga/effects';

import { collectionSaga } from './actions/CollectionAction';
import { collectionsSaga } from './actions/CollectionsAction';
import { updateCollectionSaga } from './actions/UpdateCollectionAction';
import { createCollectionSaga } from './actions/CreateCollectionAction';
import { deleteCollectionSaga } from './actions/DeleteCollectionAction';

export default function* allCollectionSaga() {
    yield all([
        collectionSaga(),
        collectionsSaga(),
        updateCollectionSaga(),
        createCollectionSaga(),
        deleteCollectionSaga()
    ]);
}
