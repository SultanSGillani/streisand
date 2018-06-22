import * as objectAssign from 'object-assign';

import Store from '../store';
import Action from '../actions/invites';
import IInvite from '../models/IInvite';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';

type ItemMap = INodeMap<IInvite>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_INVITE_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.props.id];
            return copy;
        case 'RECEIVED_NEW_INVITE':
            return addLoadedNode(state, action.invite);
        case 'RECEIVED_INVITES':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const list = getPagesReducer('INVITES');
export default combineReducers<Store.Invites>({ byId, list });