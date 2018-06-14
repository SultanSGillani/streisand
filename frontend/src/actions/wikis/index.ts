import { all } from 'redux-saga/effects';

import WikiAction, { wikiSaga } from './WikiAction';
import WikisAction, { wikisSaga } from './WikisAction';
import CreateWikiAction, { createWikiSaga } from './CreateWikiAction';
import UpdateWikiAction, { updateWikiSaga } from './UpdateWikiAction';
import DeleteWikiAction, { deleteWikiSaga } from './DeleteWikiAction';

type Action = WikisAction | CreateWikiAction | WikiAction | UpdateWikiAction | DeleteWikiAction;
export default Action;

export function* allWikiSaga() {
    yield all([
        wikiSaga(),
        wikisSaga(),
        updateWikiSaga(),
        createWikiSaga(),
        deleteWikiSaga()
    ]);
}