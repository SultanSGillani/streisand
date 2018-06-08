import Store from '../store';
import  Action from '../actions';
import { combineReducers } from './helpers';

import news from './news';
import auth from './auth';
import wiki from './wiki';
import forums from './forums';
import film from './films/film';
import torrent from './torrent';
import user from './users/user';
import torrentUpload from './torrentUpload';
import currentUser from './users/currentUser';

const combined = combineReducers<Store.UserSealed>({
    auth,
    currentUser,
    user,
    film,
    torrent,
    wiki,
    news,
    forums,
    torrentUpload
});

export default (state: Store.UserSealed, action: Action) => {
    if (action.type === 'RECEIVED_LOGOUT') {
        return combined(undefined as any, action);
    }
    return combined(state, action);
};