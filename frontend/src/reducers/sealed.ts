import Store from '../store';
import  Action from '../actions';
import { combineReducers } from './helpers';

import news from './news';
import auth from './auth';
import films from './films';
import wikis from './wikis';
import forums from './forums';
import torrents from './torrents';
import users from './users/users';
import currentUser from './users/currentUser';

const combined = combineReducers<Store.UserSealed>({
    auth,
    currentUser,
    users,
    films,
    torrents,
    wikis,
    news,
    forums
});

export default (state: Store.UserSealed, action: Action) => {
    if (action.type === 'LOGOUT') {
        return combined(undefined as any, action);
    }
    return combined(state, action);
};