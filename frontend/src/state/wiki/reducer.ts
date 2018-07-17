import * as objectAssign from 'object-assign';

import Action from './actions';
import { IWikiStore } from './store';
import IWiki from '../../models/IWiki';
import { getPagesReducer } from '../reducers/pages';
import { INodeMap } from '../../models/base/ItemSet';
import { combineReducers } from '../reducers/helpers';
import { addLoadedNode, addLoadedNodes } from '../reducers/mutations';

type ItemMap = INodeMap<IWiki>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_WIKI_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.props.id];
            return copy;
        case 'RECEIVED_WIKI':
        case 'RECEIVED_NEW_WIKI':
        case 'RECEIVED_WIKI_UPDATE':
            return addLoadedNode(state, action.wiki);
        case 'RECEIVED_WIKIS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

function creating(state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case 'REQUEST_NEW_WIKI':
            return true;
        case 'RECEIVED_NEW_WIKI':
        case 'FAILED_NEW_WIKI':
            return false;
        default:
            return state;
    }
}

const list = getPagesReducer('WIKIS');
export default combineReducers<IWikiStore>({ byId, list, creating });