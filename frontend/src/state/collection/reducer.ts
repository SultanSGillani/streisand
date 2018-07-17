import * as objectAssign from 'object-assign';

import Action from './actions';
import { ICollectionStore } from './store';
import ICollection from '../../models/ICollection';
import { getPagesReducer } from '../reducers/pages';
import { INodeMap } from '../../models/base/ItemSet';
import { combineReducers } from '../reducers/helpers';
import { addLoadedNode, addLoadedNodes } from '../reducers/mutations';

type ItemMap = INodeMap<ICollection>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_COLLECTION_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.props.id];
            return copy;
        case 'RECEIVED_COLLECTION':
        case 'RECEIVED_NEW_COLLECTION':
        case 'RECEIVED_COLLECTION_UPDATE':
            return addLoadedNode(state, action.collection);
        case 'RECEIVED_COLLECTIONS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

function creating(state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case 'REQUEST_NEW_COLLECTION':
            return true;
        case 'RECEIVED_NEW_COLLECTION':
        case 'FAILED_NEW_COLLECTION':
            return false;
        default:
            return state;
    }
}

const list = getPagesReducer('COLLECTIONS');
export default combineReducers<ICollectionStore>({ byId, list, creating });
