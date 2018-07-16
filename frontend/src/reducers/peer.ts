import * as objectAssign from 'object-assign';

import Store from '../store';
import Action from '../actions/peers';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { ITrackerPeer } from '../models/ITrackerPeer';
import { addLoadedNodes } from './utilities/mutations';
import { IItemPages } from '../models/base/IPagedItemSet';

type ItemMap = INodeMap<ITrackerPeer>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_PEERS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const torrentPagesReducer = getPagesReducer('PEERS');
type Peers = { [id: number]: IItemPages };
function byTorrentId(state: Peers = {}, action: Action): Peers {
    switch (action.type) {
        case 'REQUEST_PEERS':
        case 'RECEIVED_PEERS':
        case 'FAILED_PEERS':
            const currentItemSet = state[action.props.id];
            const newItemSet = torrentPagesReducer(currentItemSet, action);
            return objectAssign({}, state, { [action.props.id]: newItemSet });
        default:
            return state;
    }
}

export default combineReducers<Store.Peers>({ byId, byTorrentId });