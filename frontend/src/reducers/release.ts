
import Store from '../store';
import Action from '../actions/releases';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { addLoadedNode } from './utilities/mutations';
import IRelease from '../models/IRelease';

type ItemMap = INodeMap<IRelease>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_NEW_RELEASE':
            return addLoadedNode(state, action.release);
        default:
            return state;
    }
}

export default combineReducers<Store.Releases>({ byId });