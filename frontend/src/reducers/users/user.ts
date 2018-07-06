
import Store from '../../store';
import Action from '../../actions';
import IUser from '../../models/IUser';
import { combineReducers } from '../helpers';
import { INodeMap } from '../../models/base/ItemSet';
import { getPagesReducer } from '../utilities/pages';
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
        case 'RECEIVED_FILM_TORRENTS':
        case 'RECEIVED_RELEASE_TORRENTS':
            return addLoadedNodes(state, action.users);
        default:
            return state;
    }
}

const list = getPagesReducer('USERS');
export default combineReducers<Store.Users>({ byId, list });