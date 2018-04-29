import * as objectAssign from 'object-assign';

import Store from '../store';
import IWiki from '../models/IWiki';
import Action from '../actions/wikis';
import { combineReducers } from './helpers';
import { IPage } from '../models/base/IPagedItemSet';
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
            for (const item of action.wikis) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

type Pages = { [page: number]: IPage<IWiki> };
function pages(state: Pages = {}, action: Action): Pages {
    let page: IPage<IWiki>;
    switch (action.type) {
        case 'FETCHING_WIKIS':
            page = objectAssign({ items: [] }, state[action.page], { loading: true });
            return objectAssign({}, state, { [action.page]: page });
        case 'RECEIVED_WIKIS':
            page = { loading: false, items: action.wikis };
            return objectAssign({}, state, { [action.page]: page });
        case 'WIKIS_FAILURE':
            page = objectAssign({ items: [] }, state[action.page], { loading: false });
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
        case 'WIKI_CREATION_FAILURE':
            return false;
        default:
            return state;
    }
}

export default combineReducers<Store.Wikis>({ byId, count, pages, creating });