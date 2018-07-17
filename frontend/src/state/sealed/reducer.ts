
import Action from '../actions';
import { ISealedStore } from './store';
import { combineReducers } from '../reducers/helpers';

import news from '../news/reducer';
import auth from '../auth/reducer';
import wiki from '../wiki/reducer';
import peer from '../peer/reducer';
import film from '../film/reducer';
import user from '../user/reducer';
import forum from '../forum/reducer';
import invite from '../invite/reducer';
import torrent from '../torrent/reducer';
import release from '../release/reducer';
import comment from '../comment/reducer';
import collection from '../collection/reducer';

const combined = combineReducers<ISealedStore>({
    auth,
    user,
    collection,
    film,
    torrent,
    wiki,
    news,
    forum,
    release,
    invite,
    peer,
    comment
});

export default (state: ISealedStore, action: Action) => {
    if (action.type === 'RECEIVED_LOGOUT') {
        return combined(undefined as any, action);
    }
    return combined(state, action);
};
