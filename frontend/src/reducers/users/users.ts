
import Store from '../../store';
import IUser from '../../models/IUser';
import { combineReducers } from '../helpers';
import UserAction from '../../actions/users';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { IPage, INodeMap } from '../../models/base/IPagedItemSet';
import { addLoadedNodes, addLoadedNode } from '../utilities/mutations';

type Action = UserAction | ForumAction | NewsAction;

type ItemMap = INodeMap<IUser>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            return addLoadedNodes(state, action.data.users);
        case 'RECEIVED_USER':
        case 'RECEIVED_CURRENT_USER':
            return addLoadedNode(state, action.user);
        default:
            return state;
    }
}

type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    return state;
}

function count(state: number = 0, action: Action): number {
    return state;
}

export default combineReducers<Store.Users>({ byId, count, pages });