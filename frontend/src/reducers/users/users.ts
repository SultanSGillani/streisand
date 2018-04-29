import * as objectAssign from 'object-assign';

import Store from '../../store';
import IUser from '../../models/IUser';
import { combineReducers } from '../helpers';
import UserAction from '../../actions/users';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { IPage } from '../../models/base/IPagedItemSet';
import ILoadingItem from '../../models/base/ILoadingItem';

type Action = UserAction | ForumAction | NewsAction;

type ItemMap = { [id: number]: IUser | ILoadingItem };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            const map: ItemMap = {};
            for (const item of action.data.users) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        case 'RECEIVED_USER':
        case 'RECEIVED_CURRENT_USER':
            return objectAssign({}, state, { [action.user.id]: action.user });
        default:
            return state;
    }
}

type Pages = { [page: number]: IPage<IUser> };
function pages(state: Pages = {}, action: Action): Pages {
    return state;
}

function count(state: number = 0, action: Action): number {
    return state;
}

export default combineReducers<Store.Users>({ byId, count, pages });