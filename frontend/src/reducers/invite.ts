import * as objectAssign from 'object-assign';

import Store from '../store';
import Action from '../actions/invites';
import IInvite from '../models/IInvite';
import { combineReducers } from './helpers';
import { getPageReducer } from './utilities/page';
import { INodeMap } from '../models/base/ItemSet';
import { IPage, INestedPage } from '../models/base/IPagedItemSet';
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

const pageReducer = getPageReducer('INVITES');
type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'REQUEST_INVITES':
        case 'RECEIVED_INVITES':
        case 'FAILED_INVITES':
        case 'INVALIDATE_INVITES':
            const page: IPage = pageReducer(state[action.props.page], action);
            return objectAssign({}, state, { [action.props.page]: page });
        default:
            return state;
    }
}

function pageSize(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_INVITES':
            return action.props.pageSize;
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_INVITES':
            return action.props.count;
        default:
            return state;
    }
}

const list = combineReducers<INestedPage>({ count, pageSize, pages });
export default combineReducers<Store.Invites>({ byId, list });