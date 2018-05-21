import * as objectAssign from 'object-assign';

import Store from '../store';
import IWiki from '../models/IWiki';
import Action from '../actions/wikis';
import { combineReducers } from './helpers';
import { getPageReducer } from './utilities/page';
import { IPage, INodeMap } from '../models/base/IPagedItemSet';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';

type ItemMap = INodeMap<IWiki>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_WIKI_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.id];
            return copy;
        case 'RECEIVED_WIKI':
            return addLoadedNode(state, action.wiki);
        case 'RECEIVED_WIKIS':
            return addLoadedNodes(state, action.items);
        default:
            return state;
    }
}

const pageReducer = getPageReducer('WIKIS');
type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'REQUEST_WIKIS':
        case 'RECEIVED_WIKIS':
        case 'FAILED_WIKIS':
        case 'INVALIDATE_WIKIS':
            const page: IPage = pageReducer(state[action.page], action);
            return objectAssign({}, state, { [action.page]: page });
        default:
            return state;
    }
}

function pageSize(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_WIKIS':
            return action.pageSize;
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_WIKIS':
            return action.count;
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

export default combineReducers<Store.Wikis>({ byId, pages, pageSize, count, creating });