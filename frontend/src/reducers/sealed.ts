import Store from '../store';
import  Action from '../actions';
import { combineReducers } from './helpers';

import news from './news';
import auth from './auth';
import wiki from './wiki';
import peer from './peer';
import film from './film';
import invite from './invite';
import forums from './forums';
import torrent from './torrent';
import user from './users/user';
import release from './release';
import comment from './comment';
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
    release,
    invite,
    peer,
    comment
});

export default (state: Store.UserSealed, action: Action) => {
    if (action.type === 'RECEIVED_LOGOUT') {
        return combined(undefined as any, action);
    }
    return combined(state, action);
};