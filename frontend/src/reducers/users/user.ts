
import Store from '../../store';
import Action from '../../actions';
import IUser from '../../models/IUser';
import { combineReducers } from '../helpers';
import { INodeMap } from '../../models/base/ItemSet';
import { IPage, INestedPage } from '../../models/base/IPagedItemSet';
import { addLoadedNodes, addLoadedNode } from '../utilities/mutations';

type ItemMap = INodeMap<IUser>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_USER':
        case 'RECEIVED_CURRENT_USER':
        case 'RECEIVED_USER_UPDATE':
            return addLoadedNode(state, action.user);
        case 'RECEIVED_BULK_USERS':
        case 'RECEIVED_DETACHED_TORRENTS':
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