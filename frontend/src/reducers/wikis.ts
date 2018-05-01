import * as objectAssign from 'object-assign';

import Store from '../store';
import IWiki from '../models/IWiki';
import Action from '../actions/wikis';
import { combineReducers } from './helpers';
import { IPage } from '../models/base/IPagedItemSet';
import { getPageReducer } from './utilities/reducers';
import ILoadingItem from '../models/base/ILoadingItem';

type ItemMap = { [id: number]: IWiki | ILoadingItem };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'REMOVED_WIKI':
            const copy = objectAssign({}, state);
            delete copy[action.id];
            return copy;
        case 'RECEIVED_WIKI':
            return objectAssign({}, state, { [action.wiki.id]: action.wiki });
        case 'RECEIVED_WIKIS':
            let map: ItemMap = {};
            for (const item of action.items) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

const pageReducer = getPageReducer<IWiki>('WIKIS');
type Pages = { [page: number]: IPage<IWiki> };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'FETCHING_WIKIS':
        case 'RECEIVED_WIKIS':
        case 'FAILED_WIKIS':
            const page: IPage<IWiki> = pageReducer(state[action.page], action);
            return objectAssign({}, state, { [action.page]: page });
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
        case 'CREATING_WIKI':
            return true;
        case 'CREATED_WIKI':
        case 'FAILED_CREATING_WIKI':
            return false;
        default:
            return state;
    }
}

export default combineReducers<Store.Wikis>({ byId, pages, count, creating });