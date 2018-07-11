
import Store from '../store';
import Action from '../actions/peers';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { ITrackerPeer } from '../models/ITrackerPeer';
import { addLoadedNodes } from './utilities/mutations';

type ItemMap = INodeMap<ITrackerPeer>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_PEERS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const list = getPagesReducer('PEERS');
export default combineReducers<Store.Peers>({ byId, list });