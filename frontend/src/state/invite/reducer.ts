import * as objectAssign from 'object-assign';

import Action from './actions';
import { IInviteStore } from './store';
import IInvite from '../../models/IInvite';
import { INodeMap } from '../../models/base/ItemSet';
import { getPagesReducer } from '../reducers/pages';
import { combineReducers } from '../reducers/helpers';
import { addLoadedNode, addLoadedNodes } from '../reducers/mutations';

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
export default combineReducers<IInviteStore>({ byId, list });