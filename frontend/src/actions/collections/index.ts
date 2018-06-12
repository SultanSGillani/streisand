import { all } from 'redux-saga/effects';

import CollectionAction, { collectionSaga } from './CollectionAction';
import CollectionsAction, { collectionsSaga } from './CollectionsAction';

type Action = CollectionAction | CollectionsAction;
export default Action;

export function* allCollectionSaga() {
    yield all([
        collectionSaga(),
        collectionsSaga()
    ]);
}