import * as objectAssign from 'object-assign';

import Action from './actions';
import { IPeerStore } from './store';
import { getPagesReducer } from '../reducers/pages';
import { INodeMap } from '../../models/base/ItemSet';
import { combineReducers } from '../reducers/helpers';
import { addLoadedNodes } from '../reducers/mutations';
import { ITrackerPeer } from '../../models/ITrackerPeer';
import { IItemPages } from '../../models/base/IPagedItemSet';

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

export default combineReducers<IPeerStore>({ byId, byTorrentId });