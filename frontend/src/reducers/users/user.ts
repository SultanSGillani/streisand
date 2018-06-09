
import Store from '../../store';
import IUser from '../../models/IUser';
import { combineReducers } from '../helpers';
import UserAction from '../../actions/users';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { INodeMap } from '../../models/base/ItemSet';
import { IPage, INestedPage } from '../../models/base/IPagedItemSet';
import { addLoadedNodes, addLoadedNode } from '../utilities/mutations';

type Action = UserAction | ForumAction | NewsAction;

type ItemMap = INodeMap<IUser>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_USER':
        case 'RECEIVED_CURRENT_USER':
            return addLoadedNode(state, action.user);
        case 'RECEIVED_BULK_USERS':
            return addLoadedNodes(state, action.users);
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

function pageSize(state: number = 0, action: Action): number {
    return state;
}

const list = combineReducers<INestedPage>({ count, pageSize, pages });
export default combineReducers<Store.Users>({ byId, list });